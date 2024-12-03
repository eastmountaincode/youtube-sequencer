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

### Get a list of all available availability zones in our region
data "aws_availability_zones" "availability_zones" {}

### Get the default subnets in two different availability zones
resource "aws_default_subnet" "subnet_az1" {
  availability_zone = data.aws_availability_zones.availability_zones.names[0]
}

resource "aws_default_subnet" "subnet_az2" {
  availability_zone = data.aws_availability_zones.availability_zones.names[1]
}

### Create security group for RDS database access
resource "aws_security_group" "rds_security_group" {
  name        = "database_security_group"
  description = "Enable PostgreSQL access on port 5432"
  vpc_id      = aws_default_vpc.default_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow access from anywhere
  }

  tags = {
    Name = "database_security_group"
  }
}







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

### Create a new security group called youtube-sequencer-rds

## Get our IP
data "http" "ip" {
  url = "https://api.ipify.org"
}

resource "aws_security_group" "rds" {
  name        = "youtube-sequencer-rds"
  description = "Allow PostgreSQL inbound traffic"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["${data.http.ip.response_body}/32"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["${data.http.ip.response_body}/32"]
  }
}

output "ip" {
  value = data.http.ip.response_body
}

### Create a RDS database instance to store Pattern and Like data
resource "aws_db_instance" "pattern_db" {
  identifier          = "youtube-sequencer-db"
  engine              = "postgres"
  engine_version      = "17.2"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  
  db_name             = "youtube_sequencer"
  username           = "postgres"
  password           = var.db_password
  
  skip_final_snapshot = true ## don't create a final backup snapshot when database is deleted
  multi_az            = false ## keeps the database in a single availability zone
  publicly_accessible = false ## don't allow public access to the database

  vpc_security_group_ids = [aws_security_group.rds.id]

}

### Output the RDS instance endpoint
output "rds_endpoint" {
  value = aws_db_instance.pattern_db.endpoint
}
