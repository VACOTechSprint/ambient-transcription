provider "google" {
  project = "vacotechsprint"
  region  = "us-east4"
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

  metadata = {
    ssh-keys = "dahifi:ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBNrvjg1D+tS4LLT90QivaBO6xqIJz8vv4JpG21bz76ntIrlZNfC7k8cpb2DxBWC7K69vzGEKfiqpBjvA0wv7wNw= google-ssh {\"userName\":\"dahifi@gmail.com\",\"expireOn\":\"2024-01-29T15:34:04+0000\"}\ndahifi:ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAGrMm+AQ22jY9xXjyv+/t3zqN9PNn1QcJshuCu3sqFOI9rPY39LQ/7pEEoe7T4fOWR6Keh18BzWci31yurf/c4azEJ7KQXvEQua9L4HdrJWhTN5py8lj/27kdYcnzEOX3sbrS0jTk7tb3Zqsd6+YTglDM7abRzwZ6SBTyf3G2e8uhGFiCu9P4XfEhxAlrepyB5wEE9szkO2CURIZBcuTt8QT6Q9/lQ3E9tP04LcpuW3bfjzTc3+YetI831dOkWH8M9WVl8mdlWFYt4NHIhdMM62+Ge6wlFyn6MdEQKnqSoNYja+PtShTijRdcTLoUE7t3G3AiKsrfardF/5X5BhIXqE= google-ssh {\"userName\":\"dahifi@gmail.com\",\"expireOn\":\"2024-01-29T15:34:18+0000\"}"
  }

  name = "whisperx-asr"

  network_interface {
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
    preemptible         = false
    provisioning_model  = "SPOT"
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
}

resource "google_storage_bucket" "output_bucket" {
  name          = "vaco-output-bucket"
  location      = "US"
  force_destroy = true
}