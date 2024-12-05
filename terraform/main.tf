### Configure the AWS Provider with existing credentials
provider "aws" {
  region = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

### Use default VPC
resource "aws_default_vpc" "default_vpc" {

  tags = {
    Name = "default vpc"
  }
}

############################## Subnet creation start ###############################

### Get a list of all available availability zones in our region
data "aws_availability_zones" "availability_zones" {}

### Get the default subnets in two different availability zones
resource "aws_default_subnet" "subnet_az1" {
  availability_zone = data.aws_availability_zones.availability_zones.names[0]
}

resource "aws_default_subnet" "subnet_az2" {
  availability_zone = data.aws_availability_zones.availability_zones.names[1]
}

### Create private subnets for RDS
resource "aws_subnet" "private_subnet_az1" {
  vpc_id            = aws_default_vpc.default_vpc.id
  cidr_block        = "172.31.128.0/20"
  availability_zone = data.aws_availability_zones.availability_zones.names[0]

  tags = {
    Name = "private-subnet-1"
  }
}

resource "aws_subnet" "private_subnet_az2" {
  vpc_id            = aws_default_vpc.default_vpc.id
  cidr_block        = "172.31.144.0/20"
  availability_zone = data.aws_availability_zones.availability_zones.names[1]

  tags = {
    Name = "private-subnet-2"
  }
}

############################## Subnet creation end ###############################

############################## Subnet group creation start ###############################

### Create database subnet group (private)
resource "aws_db_subnet_group" "database_subnet_group" {
  name        = "database-subnet-group"
  description = "DB subnet group for RDS"
  subnet_ids  = [aws_subnet.private_subnet_az1.id, aws_subnet.private_subnet_az2.id]

  tags = {
    Name = "database-subnet-group"
  }
}

############################## Subnet group creation end ###############################

############################## Security group creation start ###############################


### Create security group for RDS database access
resource "aws_security_group" "rds_security_group" {
  name        = "database_security_group"
  description = "Enable PostgreSQL access on port 5432"
  vpc_id      = aws_default_vpc.default_vpc.id

  ingress {
    from_port   = 5432 ## default port for PostgreSQL
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.ec2_security_group.id] // allow access from EC2 instance
    cidr_blocks = ["0.0.0.0/0"]  # Allow access from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

### Create security group for EC2 instance
resource "aws_security_group" "ec2_security_group" {
  name        = "ec2_security_group"
  description = "Enable SSH and API access"
  vpc_id      = aws_default_vpc.default_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # SSH access
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # API access
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

############################## Security group creation end ###############################

######################## S3 bucket start #######################################

### Create an S3 bucket to store our .dance pattern files
resource "aws_s3_bucket" "pattern_storage" {
  bucket = "youtube-sequencer-patterns"  # the actual name of the bucket visible in AWS
}

### Configure CORS rules for the S3 bucket to allow web access
resource "aws_s3_bucket_cors_configuration" "pattern_storage" {
  bucket = aws_s3_bucket.pattern_storage.id  # Reference the bucket we created above

  cors_rule {
    allowed_headers = ["*"]                    # Allow all headers
    allowed_methods = ["GET", "PUT", "POST"]   # HTTP methods needed for file operations
    allowed_origins = ["http://localhost:3000"] # Allow requests from our React dev server
    expose_headers  = ["ETag"]                 # Expose ETag for caching
    max_age_seconds = 3000                     # Browser can cache CORS response
  }
}

### Disable versioning
resource "aws_s3_bucket_versioning" "pattern_storage" {
  bucket = aws_s3_bucket.pattern_storage.id
  versioning_configuration {
    status = "Disabled"
  }
}

### Enable server-side encryption by default
resource "aws_s3_bucket_server_side_encryption_configuration" "pattern_storage" {
  bucket = aws_s3_bucket.pattern_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

### Block public access
resource "aws_s3_bucket_public_access_block" "pattern_storage" {
  bucket = aws_s3_bucket.pattern_storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

######################## S3 bucket end #######################################

######################## RDS start #######################################

### Create a RDS database instance 
resource "aws_db_instance" "pattern_db" {
  identifier          = "youtube-sequencer-db"
  engine              = "postgres"
  engine_version      = "17.2"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  db_subnet_group_name = aws_db_subnet_group.database_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_security_group.id]
  availability_zone   = data.aws_availability_zones.availability_zones.names[0]

  db_name             = "youtube_sequencer"
  username           = "postgres"
  password           = var.db_password
  
  skip_final_snapshot = true ## don't create a final backup snapshot when database is deleted
  multi_az            = false ## keeps the database in a single availability zone
  publicly_accessible = false ## we'll access it through an EC2 instance

}

######################## RDS end #######################################

######################## EC2 start #######################################

### Create EC2 instance
resource "aws_instance" "api_server" {
  ami           = "ami-0c7217cdde317cfec"  # Amazon Linux 2023 AMI
  instance_type = "t2.micro"
  subnet_id     = aws_default_subnet.subnet_az1.id ## public subnet
  key_name = "youtube-sequencer-key"

  
  vpc_security_group_ids = [aws_security_group.ec2_security_group.id]

  tags = {
    Name = "youtube-sequencer-api"
  }
}

########################### EC2 end #######################################

########################### outputs start #######################################

### Output the EC2 instance public IP
output "ec2_public_ip" {
  value = aws_instance.api_server.public_ip
}

### Output the RDS instance endpoint
output "rds_endpoint" {
  value = aws_db_instance.pattern_db.endpoint
}

########################### outputs end #######################################
