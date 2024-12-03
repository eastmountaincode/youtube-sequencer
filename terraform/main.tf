### Configure the AWS Provider - this tells Terraform to use AWS
provider "aws" {
  region = "us-east-1"  # specify the region
}

### Create an S3 bucket to store our .dance pattern files
### pattern_storage is the local name of the bucket
### this line is declaring a variable called pattern_storage, 
### ...like var pattern_storage = youtube-sequencer-patterns
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

### Enable versioning to protect against accidental deletes
### ...just kidding, we don't have to do this because we're not changing the .dance files
### setting it to "Disabled" now.
### ...ok we can't disable, but we can set it to "Suspended"
resource "aws_s3_bucket_versioning" "pattern_storage" {
  bucket = aws_s3_bucket.pattern_storage.id
  versioning_configuration {
    status = "Suspended"
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
  
  # Free tier settings
  multi_az            = false ## keeps the database in a single availability zone
  publicly_accessible = false ## don't allow public access to the database
}


