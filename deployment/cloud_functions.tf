resource "google_storage_bucket" "default" {
  name = "vaco-cloud-functions"
  location = "US"
}


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


resource "google_storage_bucket_object" "default" {
  name   = "index-${timestamp()}.js.zip" # Dynamically generate a unique name
  bucket = google_storage_bucket.default.name
  source = "../cloud_functions/index.js.zip"

    metadata = {
    content-hash = "2a3e45dd37228b0ab82efba9e961fe28"
  }
}

output "default_function_url" {
  value = google_cloudfunctions_function.default.https_trigger_url
}

output "signed_url_function_url" {
  value = google_cloudfunctions_function.signed_url.https_trigger_url
}

resource "google_cloudfunctions_function_iam_binding" "signed_url_invoker" {
  project = google_cloudfunctions_function.signed_url.project
  region = google_cloudfunctions_function.signed_url.region
  cloud_function = google_cloudfunctions_function.signed_url.name

  role = "roles/cloudfunctions.invoker"

  members = [
    "allUsers"
  ]
}

resource "google_cloudfunctions_function_iam_binding" "public_invoker" {
  project = google_cloudfunctions_function.signed_url.project
  region = google_cloudfunctions_function.default.region
  cloud_function = google_cloudfunctions_function.default.name

  role = "roles/cloudfunctions.invoker"

  members = [
    "allUsers"
  ]
}


resource "google_service_account" "signed_url_function_sa" {
  account_id   = "signed-url-function-sa"
  display_name = "Service Account for signed_url function"
}

resource "google_service_account_iam_member" "sa_token_creator" {
  service_account_id = google_service_account.signed_url_function_sa.id
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${google_service_account.signed_url_function_sa.email}"
}