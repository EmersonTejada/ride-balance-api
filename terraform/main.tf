data "cloudflare_ip_ranges" "cloudflare" {

}

resource "aws_ec2_managed_prefix_list" "cloudflare_list" {
  name           = "Cloudflare-Dynamics-IPs"
  address_family = "IPv4"
  max_entries    = length(data.cloudflare_ip_ranges.cloudflare.ipv4_cidrs)

  dynamic "entry" {
    for_each = data.cloudflare_ip_ranges.cloudflare.ipv4_cidrs
    content {
      cidr        = entry.value
      description = "Cloudflare Edge Node"
    }
  }
}

resource "aws_security_group" "ride_balance_sg" {
  name        = "ride-balance-sg"
  description = "Ride Balance Security Group"

  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    prefix_list_ids = [aws_ec2_managed_prefix_list.cloudflare_list.id]
  }

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    prefix_list_ids = [aws_ec2_managed_prefix_list.cloudflare_list.id]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

