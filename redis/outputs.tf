### output variables

output "endpoint" {
  description = "The enpoints of Redis cluster"
  value       = aws_elasticache_replication_group.redis.configuration_endpoint_address
}

output "kubeconfig" {
  description = "Bash script to update kubeconfig file"
  value       = module.eks.kubeconfig
}

output "build" {
  description = "Bash script to start build"
  value       = module.ci.build
}
