terraform {
  backend "s3" {
    bucket = var.backend_bucket
    key    = "terraform.tfstate"
    region = var.backend_region
    encrypt = true
  }
}

variable "backend_bucket" {}
variable "backend_region" {}
