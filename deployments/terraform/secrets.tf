resource "aws_secretsmanager_secret" "production" {
  name        = "ride-balance-production"
  description = "Production secrets for Ride Balance API"
  
  recovery_window_in_days = 7

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_secretsmanager_secret_version" "production" {
  secret_id = aws_secretsmanager_secret.production.id
  
  secret_string = jsonencode({
    DATABASE_URL    = "postgresql://user:password@host:5432/db"
    JWT_SECRET     = "change-me-in-production"
    PORT          = "3000"
  })
}