terraform {
  required_version = ">= 1.6"
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

resource "random_id" "example" {
  byte_length = 4
}

resource "local_file" "hello" {
  filename = "${path.module}/hello-${random_id.example.hex}.txt"
  content  = "Hello from OpenTofu!\nID: ${random_id.example.hex}\n"
}

output "file" {
  value = local_file.hello.filename
}
