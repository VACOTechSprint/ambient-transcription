provider "google" {
  project = "vacotechsprint"
  region  = "us-east4"
}

resource "google_compute_firewall" "whisperx_asr_firewall" {
  name    = "whisper-asr"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["9000"]  # Update this based on the rule's actual allowed ports
  }

  allow {
    protocol = "udp"
    ports    = ["9000"]  # Update this based on the rule's actual allowed ports
  }

  target_tags = ["whisper-asr"]  # Ensure other properties like target tags match too
}

resource "google_compute_instance" "whisperx_asr" {
  boot_disk {
    auto_delete = true
    device_name = "instance-1"

    initialize_params {
      image = "projects/ml-images/global/images/c0-deeplearning-common-gpu-v20240111-debian-11-py310"
      size  = 100
      type  = "pd-balanced"
    }

    mode = "READ_WRITE"
  }

  can_ip_forward      = false
  deletion_protection = false
  enable_display      = false

  guest_accelerator {
    count = 1
    type  = "projects/vacotechsprint/zones/us-east4-a/acceleratorTypes/nvidia-tesla-t4"
  }

  labels = {
    goog-ec-src           = "vm_add-tf"
    goog-ops-agent-policy = "v2-x86-template-1-1-0"
  }

  machine_type = "n1-highmem-4"

  name = "whisperx-asr"

  network_interface {
    network = "default"

    access_config {
      network_tier = "PREMIUM"
    }

    queue_count = 0
    stack_type  = "IPV4_ONLY"
    subnetwork  = "projects/vacotechsprint/regions/us-east4/subnetworks/default"
  }

  scheduling {
    automatic_restart   = false
    on_host_maintenance = "TERMINATE"
    preemptible         = true
    provisioning_model  = "SPOT"
    instance_termination_action = "STOP"
  }

  service_account {
    email  = "836049505470-compute@developer.gserviceaccount.com"
    scopes = ["https://www.googleapis.com/auth/devstorage.read_only", "https://www.googleapis.com/auth/logging.write", "https://www.googleapis.com/auth/monitoring.write", "https://www.googleapis.com/auth/service.management.readonly", "https://www.googleapis.com/auth/servicecontrol", "https://www.googleapis.com/auth/trace.append"]
  }

  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_secure_boot          = false
    enable_vtpm                 = true
  }

  tags = ["whisper-asr"]
  zone = "us-east4-a"
}

resource "google_storage_bucket" "upload_bucket" {
  name          = "vaco-upload-bucket"
  location      = "US"
  force_destroy = true  # Allows Terraform to delete the bucket even if it contains objects
  cors {
      origin          = ["http://localhost:5173"]
      method          = ["GET", "PUT", "POST"]
      response_header = ["Content-Type", "Authorization", "X-Goog-Resumable"]
      max_age_seconds = 3600
    }

}

resource "google_storage_bucket" "output_bucket" {
  name          = "vaco-output-bucket"
  location      = "US"
  force_destroy = true
}

resource "google_storage_bucket" "frontend_bucket" {
  name          = "vaco-frontend-app-bucket"
  location      = "US"
  force_destroy = true  # Allows Terraform to delete the bucket even if it contains objects. Use with caution.

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

# Grant public read access to the objects in the bucket
resource "google_storage_bucket_iam_binding" "public_read" {
  bucket = google_storage_bucket.frontend_bucket.name
  role   = "roles/storage.objectViewer"

  members = [
    "allUsers",
  ]
}