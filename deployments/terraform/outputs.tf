output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "Public Subnet ID"
  value       = aws_subnet.public.id
}

output "server_public_ip" {
  description = "IP pública del servidor de producción"
  value       = aws_instance.ride_balance_server.public_ip
}

output "server_private_ip" {
  description = "IP privada del servidor"
  value       = aws_instance.ride_balance_server.private_ip
}