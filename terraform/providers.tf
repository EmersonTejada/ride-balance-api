terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }

  backend "s3" {
    bucket         = "ridebalance-terraform-state-890606434054-us-east-2-an" 
    key            = "ride-balance/terraform.tfstate"           
    region         = "us-east-2"                       
    encrypt        = true                              
    use_lockfile   = true                 
  }
}

provider "aws" {
  region = "us-east-2"
}

provider "cloudflare" {

}
