locals {
  default-tags = merge(
    { "terraform.io" = "managed" },
    { "Name" = var.name }
  )
}
