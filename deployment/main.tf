provider "google" {
  project = "vacotechsprint"
  region  = "us-east4-a"
}

resource "google_storage_bucket" "upload_bucket" {
  name          = "vaco-upload-bucket"
  location      = "US"
  force_destroy = true  # Allows Terraform to delete the bucket even if it contains objects
}

resource "google_storage_bucket" "output_bucket" {
  name          = "vaco-output-bucket"
  location      = "US"
  force_destroy = true
}