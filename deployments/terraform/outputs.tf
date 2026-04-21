output "server_public_ip" {
  description = "IP pública del servidor de producción"
  value       = aws_instance.ride_balance_server.public_ip
}