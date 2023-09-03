### output variables

output "kubeconfig" {
  description = "Bash script to update kubeconfig file"
  value       = module.eks.kubeconfig
}

output "build" {
  description = "Bash script to start build"
  value       = module.ci.build
}
