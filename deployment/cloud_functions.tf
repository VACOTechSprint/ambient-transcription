# Bucket for cloud functions
resource "google_storage_bucket" "default" {
  name = "vaco-cloud-functions"
  location = "US"
}

# All functions are available through index.js
resource "google_storage_bucket_object" "default" {
  name   = "index-${timestamp()}.js.zip" # Dynamically generate a unique name
  bucket = google_storage_bucket.default.name
  source = "../cloud_functions/index.js.zip"

    metadata = {
    content-hash = "2a3e45dd37228b0ab82efba9e961fe28"
  }
}


# Hello world test function
resource "google_cloudfunctions_function" "default" {
  name        = "hello-world-function"
  description = "A simple hello world function"
  runtime     = "nodejs20"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.default.name
  source_archive_object = google_storage_bucket_object.default.name
  trigger_http          = true
  entry_point           = "helloWorld"
}

output "default_function_url" {
  value = google_cloudfunctions_function.default.https_trigger_url
}

# Public IAM binding for hello world
resource "google_cloudfunctions_function_iam_binding" "public_invoker" {
  project = google_cloudfunctions_function.default.project
  region = google_cloudfunctions_function.default.region
  cloud_function = google_cloudfunctions_function.default.name

  role = "roles/cloudfunctions.invoker"

  members = [
    "allUsers"
  ]
}

# Signed URL function
resource "google_cloudfunctions_function" "signed_url" {
  name        = "signed-url-function"
  description = "Generates a signed URL for bucket"
  runtime     = "nodejs20"

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.default.name
  source_archive_object = google_storage_bucket_object.default.name
  trigger_http          = true
  entry_point           = "generateSignedUrl"

  // Specify the service account email for the Cloud Function
  service_account_email = google_service_account.signed_url_function_sa.email
}

output "signed_url_function_url" {
  value = google_cloudfunctions_function.signed_url.https_trigger_url
}

# public binding
resource "google_cloudfunctions_function_iam_binding" "signed_url_invoker" {
  project = google_cloudfunctions_function.signed_url.project
  region = google_cloudfunctions_function.signed_url.region
  cloud_function = google_cloudfunctions_function.signed_url.name

  role = "roles/cloudfunctions.invoker"

  members = [
    "allUsers"
  ]
}

# Service account
resource "google_service_account" "signed_url_function_sa" {
  account_id   = "signed-url-function-sa"
  display_name = "Service Account for signed_url function"
}

# Grant the signed url sa ability to create tokens
resource "google_service_account_iam_member" "sa_token_creator" {
  service_account_id = google_service_account.signed_url_function_sa.id
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.signed_url_function_sa.email}"
}

# Grant the Signed URL account permission to create objects in the upload bucket
resource "google_storage_bucket_iam_member" "sa_object_creator" {
  bucket = google_storage_bucket.upload_bucket.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${google_service_account.signed_url_function_sa.email}"
}

# ASR functions
resource "google_cloudfunctions_function" "asr_pipeline" {
  name                  = "asr-pipeline-function"
  description           = "A function to send files to the ASR server and save the response."
  runtime               = "nodejs20"
  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.default.name
  source_archive_object = google_storage_bucket_object.default.name
  entry_point           = "YOUR_FUNCTION_ENTRY_POINT"  # e.g., "sendFile"

  service_account_email = google_service_account.asr_function_sa.email

  environment_variables = {
    OUTPUT_BUCKET   = google_storage_bucket.output_bucket.name
    FRONTEND_BUCKET = google_storage_bucket.frontend_bucket.name
  }

  event_trigger {
    event_type = "google.storage.object.finalize"
    resource   = google_storage_bucket.frontend_bucket.id
  }
}

resource "google_service_account" "asr_function_sa" {
  account_id   = "send-file-service-account"
  display_name = "Cloud Function Service Account"
}

resource "google_project_iam_member" "bucket_reader" {
  project = google_cloudfunctions_function.asr_pipeline.project
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.asr_function_sa.email}"
}

resource "google_project_iam_member" "bucket_writer" {
  project = google_cloudfunctions_function.asr_pipeline.project
  role    = "roles/storage.objectCreator"
  member  = "serviceAccount:${google_service_account.asr_function_sa.email}"
}
