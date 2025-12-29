# Deployment Guide

This guide explains how to deploy the Secure Multi-Tenant SaaS Platform to a Linux server (VPS, AWS EC2, DigitalOcean Droplet, etc.) using Docker.

## Prerequisites

- A generic **Linux Server** (Ubuntu 20.04/22.04 recommended).
- **Public IP Address** (e.g., 1.2.3.4) or a **Domain Name** pointing to it.
- **Docker** and **Docker Compose** installed on the server.

## Step 1: Prepare the Server

Connect to your server via SSH:
```bash
ssh root@your_server_ip
```

Install Docker (if not installed):
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

## Step 2: Clone the Repository

Clone your project code:
```bash
git clone https://github.com/surajsingh001706/Secure-Multi-Tenant-SaaS-Platform.git
cd Secure-Multi-Tenant-SaaS-Platform
```

## Step 3: Configure Environment Variables

Since `.env` files are ignored by git for security, you must create them on the server.

1. Create `backend/.env`:
   ```bash
   nano backend/.env
   ```

2. Paste your production variables (Tip: Use a **strong** random secret for JWT):
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://user:pass@your-production-db.mongodb.net/saas_db
   JWT_SECRET=VERY_LONG_COMPLEX_SECRET_KEY_FOR_PROD
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   GEMINI_API_KEY=your_gemini_key
   NODE_ENV=production
   ```
   *Press `Ctrl+X`, then `Y`, then `Enter` to save.*

## Step 4: Start the Application

Run the application in detached mode (background):

```bash
docker compose up -d --build
```

## Step 5: Verification

- **Frontend**: Visit `http://your_server_ip:3000` (or `http://your_domain`).
- **Backend API**: Visit `http://your_server_ip:5000`.

## Optional: Production Nginx (Reverse Proxy)

To serve the app on port 80/443 (standard HTTP/HTTPS) without the port numbers:

1. Modifiy `docker-compose.yml` on the server to map Frontend to port 80:
   ```yaml
   frontend:
     ports:
       - "80:80"
   ```
2. Restart: `docker compose up -d`

## Troubleshooting

- **View Logs**: `docker compose logs -f`
- **Stop App**: `docker compose down`
- **Rebuild**: `docker compose up -d --build`
