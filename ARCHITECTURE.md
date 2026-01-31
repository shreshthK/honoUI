# Deployment Architecture (Single EC2, One Elastic IP)

This document explains how multiple apps can run on the same EC2 instance
using a single Elastic IP, and how requests are routed by port or via a
reverse proxy.

## Overview

You have one public IP (Elastic IP) that maps to a single EC2 instance.
On that EC2 instance, multiple apps run as Docker containers.
Each app is reachable either:
- By a dedicated host port, or
- Through a reverse proxy (Nginx) on port 80.

## Option A: Routing by Port (Simplest)

Each app binds to a different host port. Clients include the port in the URL.

Diagram:

Client
  |
  |  http://44.195.152.236:3000  (UI)
  |  http://44.195.152.236:3001  (API)
  v
Elastic IP -> EC2
  |
  +--------------------------+
  | Docker on EC2            |
  |                          |
  |  host:3000 -> UI container:80
  |  host:3001 -> API container:3001
  |  host:80   -> existing Nginx (tic-tac app)
  +--------------------------+

Data flow:
- Browser -> 44.195.152.236:3000 -> UI container (serves static UI)
- Browser -> 44.195.152.236:3001 -> API container (JSON / WS)

Key points:
- Each port maps to a different container.
- Security group must allow each public port.

## Option B: Reverse Proxy on Port 80 (Single Public Port)

Nginx is the main entry point and forwards traffic based on path.

Diagram:

Client
  |
  |  http://44.195.152.236/
  v
Elastic IP -> EC2 -> Nginx (port 80)
  |
  +-----------------------------------------+
  | /         -> frontend (tic-tac)         |
  | /honoui   -> honoui container           |
  | /api      -> backend API                |
  | /ws       -> backend WebSocket          |
  +-----------------------------------------+

Key points:
- Only port 80 is public.
- New apps require Nginx config updates.
- URLs are cleaner, but proxy config is required.

## When to Use Which

Use Option A (different ports) when:
- You want the fastest setup.
- You do not want to modify existing Nginx.
- You are okay with URLs like :3000.

Use Option B (single port) when:
- You want clean URLs on port 80.
- You are comfortable updating Nginx config.
- You prefer one public port in the security group.

## Current Example in This Project

Option A (recommended in this repo's deployment steps):

- UI: http://44.195.152.236:3000
- API: http://44.195.152.236:3001

Docker port mapping (host:container):
- UI: 3000:80
- API: 3001:3001
