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

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "ride_balance_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  vpc_security_group_ids = [aws_security_group.ride_balance_sg.id]

  key_name = "ride-balance-key"

  tags = {
    Name = "RideBalance-Terraform"
  }

  user_data = <<-EOF
              #!/bin/bas
              apt-get update
              apt-get install -y ca-certificates curl

              install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
              chmod a+r /etc/apt/keyrings/docker.asc

              echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
                $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
                tee /etc/apt/sources.list.d/docker.list > /dev/null

              apt-get update
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              systemctl start docker
              systemctl enable docker
              
              usermod -aG docker ubuntu
              EOF

}
