resource "google_cloudfunctions_function" "default" {
  name        = "hello-world-function"
  description = "A simple hello world function"
  runtime     = "nodejs14"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.default.name
  source_archive_object = google_storage_bucket_object.default.name
  trigger_http          = true
  entry_point           = "helloWorld"
}

resource "google_storage_bucket" "default" {
  name = "vaco-cloud-functions"
  location = "US"
}

resource "google_storage_bucket_object" "default" {
  name   = "index-${timestamp()}.js.zip" # Dynamically generate a unique name
  bucket = google_storage_bucket.default.name
  source = "../cloud_functions/index.js.zip"

    metadata = {
    content-hash = "2a3e45dd37228b0ab82efba9e961fe28"
  }
}

output "function_url" {
  value = google_cloudfunctions_function.default.https_trigger_url
}