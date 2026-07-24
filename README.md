# Self-Healing Distributed Cache

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-F46800?logo=grafana&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-v1.0-blue)

A production-inspired distributed in-memory caching system built from scratch using **Node.js**, **Express.js**, **Docker**, **Prometheus**, and **Grafana** to demonstrate the core principles of distributed systems including **Consistent Hashing**, **Replication**, **Automatic Failover**, **Self-Healing**, and **Horizontal Scalability**.

> **Educational Project:** This project is inspired by distributed caching systems such as Redis Cluster. It is designed to demonstrate how modern distributed caches work internally and is **not intended as a production replacement for Redis.**

---

# Table of Contents

- Overview
- Why This Project?
- Project Objectives
- Key Features
- Technology Stack
- System Architecture
- Core Components
- Design Principles
- Distributed Systems Concepts
- Project Structure
- Getting Started
- API Overview
- Monitoring
- Documentation
- Testing
- Future Enhancements
- Contributing
- License
- Author

---

# Overview

Traditional applications often depend on a single cache server. While simple to implement, this approach introduces a **Single Point of Failure (SPOF)**. If the cache server crashes, applications lose cached data, experience increased database load, and suffer degraded performance.

Self-Healing Distributed Cache addresses this limitation by distributing cached data across multiple cache nodes. The system automatically detects failures, reroutes requests, replicates data, and restores cluster health without requiring manual intervention.

The project demonstrates many of the concepts commonly found in modern distributed systems, including:

- Distributed Data Storage
- Consistent Hashing
- Virtual Nodes
- Replication
- Heartbeat Monitoring
- Automatic Failure Detection
- Self-Healing Recovery
- Horizontal Scaling
- Observability with Prometheus & Grafana

Rather than relying on existing distributed cache solutions, every major component has been implemented from scratch to better understand the internal architecture of distributed caching systems.

---

# Why This Project?

Distributed caching systems such as **Redis Cluster**, **Hazelcast**, and **Apache Ignite** solve complex problems involving scalability, availability, and fault tolerance. While developers commonly use these systems, understanding how they work internally provides valuable insight into distributed system design.

This project was built to explore and implement the core building blocks behind distributed caching, including:

- How requests are routed to cache nodes
- How Consistent Hashing minimizes key movement
- How replication improves availability
- How heartbeats detect node failures
- How failed nodes are automatically removed
- How data is rebalanced after topology changes
- How monitoring and metrics improve observability

The objective is educational: to gain practical experience implementing distributed systems concepts rather than simply consuming existing technologies.

---

# Project Objectives

The primary goals of this project are:

- Build a distributed in-memory cache from scratch
- Eliminate Single Points of Failure
- Support automatic failure detection
- Implement self-healing recovery mechanisms
- Achieve high availability through replication
- Demonstrate Consistent Hashing with Virtual Nodes
- Support horizontal scaling with minimal key redistribution
- Apply production-oriented backend engineering practices
- Integrate monitoring and observability
- Containerize the complete application using Docker

---

# Key Features

## Distributed Cache

- Distributed in-memory key-value storage
- Multiple independent cache nodes
- JavaScript `Map` based cache engine
- Configurable Time-To-Live (TTL)
- Automatic key expiration
- Fast in-memory data access

---

## Cluster Management

- Centralized Cluster Manager
- Dynamic node registration
- Node removal
- Cluster topology management
- Intelligent request routing
- Cluster state monitoring

---

## High Availability

- Primary-Replica architecture
- Automatic replication
- Heartbeat monitoring
- Failure detection
- Automatic failover
- Self-healing recovery

---

## Scalability

- Consistent Hashing
- Virtual Nodes
- Automatic rebalancing
- Horizontal scaling
- Minimal key redistribution

---

## Monitoring & Observability

- Cluster health monitoring
- Cache hit ratio
- Cache miss ratio
- Memory utilization
- Request throughput
- Prometheus metrics
- Grafana dashboards

---

## DevOps

- Dockerized services
- Docker Compose deployment
- GitHub Actions CI workflow
- Environment-based configuration
- Production-ready project structure

---

# Technology Stack

## Backend

- Node.js
- Express.js

## Frontend

- React
- Tailwind CSS
- Recharts

## Distributed Systems

- Consistent Hashing
- Virtual Nodes
- Replication
- Heartbeat Monitoring
- Automatic Recovery
- Cluster Rebalancing

## Monitoring

- Prometheus
- Grafana

## DevOps

- Docker
- Docker Compose
- GitHub Actions

---

# System Architecture

The application consists of multiple independent services working together to provide a fault-tolerant distributed cache.

```
                 Client
                    │
                    ▼
             API Gateway
                    │
                    ▼
           Cluster Manager
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
 Cache Node A   Cache Node B   Cache Node C
      │             │             │
      └────── Replication ────────┘
                    │
                    ▼
              Prometheus
                    │
                    ▼
                Grafana
```

### High-Level Workflow

1. Client sends request to API Gateway.
2. Gateway forwards the request to the Cluster Manager.
3. Cluster Manager determines the responsible cache node using Consistent Hashing.
4. Request is forwarded to the selected cache node.
5. Cache node stores the data and replicates it to replica nodes.
6. Metrics are collected by Prometheus.
7. Grafana visualizes cluster health and performance.

---

# Core Components

## API Gateway

The API Gateway serves as the entry point for all client requests.

Responsibilities:

- Receive client requests
- Forward requests to the Cluster Manager
- Simplify client interaction
- Decouple clients from internal services

---

## Cluster Manager

The Cluster Manager acts as the control plane of the distributed cache.

Responsibilities:

- Node registration
- Cluster topology management
- Consistent Hashing
- Request routing
- Health monitoring
- Failure detection
- Cluster rebalancing

---

## Cache Nodes

Each cache node stores a subset of the distributed data.

Responsibilities:

- In-memory cache storage
- TTL management
- Data replication
- Heartbeat reporting
- Cache metrics

---

## Monitoring Stack

Prometheus continuously collects metrics from every service, while Grafana provides dashboards for visualizing system health and performance.

Monitored metrics include:

- Cache hit ratio
- Cache miss ratio
- Memory usage
- Request count
- Active nodes
- Cluster health

---

# Design Principles

The project follows several engineering principles to maintain clean architecture and scalability.

- Single Responsibility Principle (SRP)
- Separation of Concerns
- Modular Architecture
- Configuration over Hardcoding
- Fail Fast Validation
- Documentation-First Development
- Containerized Deployment
- Production-Oriented Design
- Extensibility for Future Enhancements

---

# Distributed Systems Concepts Demonstrated

This project demonstrates practical implementations of several important distributed systems concepts.

| Concept | Purpose |
|---------|----------|
| Consistent Hashing | Efficient key distribution |
| Virtual Nodes | Better load balancing |
| Replication | High availability |
| Heartbeats | Failure detection |
| Self-Healing | Automatic recovery |
| Failover | Service continuity |
| Rebalancing | Redistribute keys after topology changes |
| Horizontal Scaling | Increase capacity by adding nodes |
| Observability | Monitor system health using metrics |

---

# Project Structure

```text
self-healing-distributed-cache/
│
├── gateway/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── cluster-manager/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── cache-node/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── prometheus/
│   └── prometheus.yml
│
├── grafana/
│   ├── dashboards/
│   └── provisioning/
│
├── docs/
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Design.md
│   ├── API.md
│   ├── Deployment.md
│   ├── DeveloperGuide.md
│   ├── Memory.md
│   ├── Phases.md
│   └── Rules.md
│
├── .github/
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

---
# Prerequisites

Before running the project, ensure the following software is installed on your machine.

| Software | Version |
|-----------|----------|
| Node.js | 18+ |
| npm | Latest |
| Docker | Latest |
| Docker Compose | Latest |
| Git | Latest |

Verify the installation using:

```bash
node -v
npm -v
docker -v
docker compose version
git --version
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/Abhishhek-Verma/self-healing-distributed-cache.git

cd self-healing-distributed-cache
```

---

## 2. Configure Environment Variables

Create a local environment file.

```bash
cp .env.example .env
```

Update the values according to your environment.

Example:

```env
GATEWAY_PORT=3000

CLUSTER_MANAGER_PORT=8082

CACHE_NODE_1_PORT=5001
CACHE_NODE_2_PORT=5002
CACHE_NODE_3_PORT=5003

PROMETHEUS_PORT=9090

GRAFANA_PORT=3001

FRONTEND_PORT=5173
```

---

## 3. Build Docker Images

```bash
docker compose build
```

or

```bash
docker compose up --build
```

---

## 4. Start the Application

```bash
docker compose up
```

Run in detached mode:

```bash
docker compose up -d
```

---

## 5. Stop the Application

```bash
docker compose down
```

Remove volumes:

```bash
docker compose down -v
```

---

# Running Services

After deployment, the following services should be available.

| Service | URL |
|----------|-----|
| API Gateway | http://localhost:3000 |
| Cluster Manager | http://localhost:8082 |
| Frontend Dashboard | http://localhost:5173 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

---

# Environment Variables

The project uses environment variables for service configuration.

| Variable | Description |
|------------|-------------|
| GATEWAY_PORT | Gateway service port |
| CLUSTER_MANAGER_PORT | Cluster Manager port |
| CACHE_NODE_PORT | Cache node port |
| HEARTBEAT_INTERVAL | Heartbeat frequency |
| HEARTBEAT_TIMEOUT | Failure detection timeout |
| TTL_DEFAULT | Default cache expiration |
| PROMETHEUS_PORT | Prometheus server port |
| GRAFANA_PORT | Grafana server port |

Refer to `.env.example` for the complete list.

---

# Docker Deployment

The entire distributed cache system is containerized using Docker Compose.

Docker Compose automatically provisions:

- API Gateway
- Cluster Manager
- Multiple Cache Nodes
- Frontend
- Prometheus
- Grafana

Benefits include:

- Consistent development environment
- Easy deployment
- Isolated services
- Simplified networking
- Scalable architecture

Start all services:

```bash
docker compose up --build
```

Scale cache nodes:

```bash
docker compose up --scale cache-node=5
```

> **Note:** If your current implementation uses individually named cache node services (for example, `cache-node-1`, `cache-node-2`, `cache-node-3`), use the configuration provided in `docker-compose.yml`. The `--scale` command applies only when the service is defined to support scaling.

---

# Local Development

If Docker is not required, each service can be started independently.

Gateway

```bash
cd gateway
npm install
npm start
```

Cluster Manager

```bash
cd cluster-manager
npm install
npm start
```

Cache Node

```bash
cd cache-node
npm install
npm start
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# API Overview

The API Gateway exposes REST endpoints for interacting with the distributed cache.

## Cache Operations

### Store Data

```http
POST /cache
```

Example Request

```json
{
    "key": "user:101",
    "value": {
        "name": "John Doe"
    }
}
```

---

### Retrieve Data

```http
GET /cache/:key
```

Example

```http
GET /cache/user:101
```

---

### Delete Data

```http
DELETE /cache/:key
```

---

## Cluster APIs

Retrieve cluster status.

```http
GET /cluster
```

---

List registered cache nodes.

```http
GET /nodes
```

---

View node health.

```http
GET /health
```

---

## Metrics

Prometheus metrics endpoint.

```http
GET /metrics
```

For the complete API specification, refer to **docs/API.md**.

---

# Request Flow

The following illustrates how a request travels through the distributed cache.

```
              Client
                 │
                 ▼
          API Gateway
                 │
                 ▼
        Cluster Manager
                 │
     Consistent Hashing
                 │
         Select Primary Node
                 │
          Store Cache Entry
                 │
        Replicate to Replica
                 │
         Return API Response
```

---

# Monitoring & Observability

The project includes built-in monitoring using Prometheus and Grafana.

Prometheus continuously collects metrics from each service while Grafana visualizes system health through dashboards.

Collected metrics include:

- Cache Hits
- Cache Misses
- Cache Hit Ratio
- Memory Usage
- Total Requests
- Active Cache Nodes
- Node Health
- Heartbeat Status
- Replication Activity

---

## Prometheus

Available at:

```
http://localhost:9090
```

Responsibilities:

- Metrics collection
- Time-series storage
- Service scraping
- Query execution

---

## Grafana

Available at:

```
http://localhost:3001
```

Dashboards include:

- Cluster Health
- Memory Usage
- Cache Performance
- Request Rate
- Active Nodes
- Cache Hit Ratio

---

# Performance Characteristics

| Operation | Complexity |
|------------|------------|
| Cache Lookup | O(1) |
| Cache Insert | O(1) |
| Cache Delete | O(1) |
| Hash Ring Lookup | O(log N) |
| Node Registration | O(V log N) |
| Rebalancing | Depends on affected keys |

Where:

- **N** = Number of physical cache nodes
- **V** = Number of virtual nodes

---

# Failure Recovery

The system automatically detects failures and recovers without manual intervention.

Failure recovery process:

1. Cache node becomes unavailable.
2. Heartbeats stop arriving.
3. Cluster Manager detects timeout.
4. Failed node is marked offline.
5. Hash ring is updated.
6. Incoming requests are rerouted.
7. Replica nodes continue serving requests.
8. Cluster health is restored.

This minimizes downtime and maintains cache availability.

---

# Screenshots

> Screenshots can significantly improve the presentation of the project. Replace the placeholders below with actual images after deployment.

## System Architecture

```
docs/images/architecture.png
```

---

## Grafana Dashboard

```
docs/images/grafana-dashboard.png
```

---

## Prometheus Targets

```
docs/images/prometheus-targets.png
```

---

## Docker Containers

```
docs/images/docker-containers.png
```

---

## Frontend Dashboard

```
docs/images/frontend-dashboard.png
```

---

## API Response Example

```
docs/images/api-response.png
```

---

# Documentation

Comprehensive documentation is available inside the `docs` directory.

| Document | Description |
|----------|-------------|
| PRD.md | Product requirements |
| Architecture.md | Overall system architecture |
| Design.md | Detailed design decisions |
| API.md | REST API documentation |
| Deployment.md | Deployment guide |
| DeveloperGuide.md | Development workflow |
| Memory.md | Development progress |
| Phases.md | Project roadmap |
| Rules.md | Coding conventions |

Each document focuses on a specific aspect of the project to keep the codebase maintainable and well documented.

---

# Testing

The project has been tested by simulating various real-world scenarios to verify correctness, fault tolerance, and system behavior.

## Functional Testing

The following operations were verified:

- Store cache entries
- Retrieve cache entries
- Delete cache entries
- Update existing keys
- TTL expiration
- Cache miss handling
- Invalid request handling

---

## Distributed System Testing

The distributed components were tested for:

- Node registration
- Node removal
- Consistent Hashing
- Virtual Node distribution
- Request routing
- Replication
- Cluster rebalancing

---

## Failure Recovery Testing

Failure scenarios tested include:

- Cache node failure
- Heartbeat timeout
- Automatic failover
- Replica availability
- Cluster recovery
- Request rerouting
- Node rejoining

---

## Monitoring Verification

Verified metrics include:

- Cache Hit Ratio
- Cache Miss Ratio
- Memory Usage
- Request Count
- Active Nodes
- Cluster Health
- Heartbeat Status

---

# Challenges Faced

Building a distributed cache from scratch involved solving several engineering challenges.

Some of the key challenges included:

- Designing an efficient Consistent Hash Ring
- Implementing Virtual Nodes for balanced key distribution
- Routing requests without exposing cluster complexity to clients
- Detecting failed nodes using heartbeats
- Preventing duplicate heartbeat execution
- Synchronizing replicated cache entries
- Rebalancing data after topology changes
- Maintaining modular architecture across multiple services
- Containerizing every component for consistent deployment
- Integrating monitoring without tightly coupling application logic

Each challenge provided practical experience with distributed systems and backend engineering concepts.

---

# Learning Outcomes

This project provided hands-on experience with several advanced software engineering topics.

Key learnings include:

- Distributed System Design
- Consistent Hashing
- Virtual Nodes
- Replication Strategies
- Fault Tolerance
- High Availability
- Heartbeat-Based Failure Detection
- Self-Healing Systems
- Horizontal Scalability
- REST API Design
- Docker & Docker Compose
- Prometheus Monitoring
- Grafana Dashboards
- Clean Architecture
- Production-Oriented Backend Development

---

# Project Highlights

This project demonstrates practical implementation of:

- Distributed In-Memory Caching
- Cluster Management
- Request Routing
- Consistent Hashing
- Automatic Failover
- Self-Healing Recovery
- Replication
- Dockerized Deployment
- Metrics Collection
- Dashboard Visualization

It combines concepts from backend development, distributed systems, DevOps, and observability into a single project.

---

# Future Enhancements

Version **1.0** focuses on Docker-based deployment and core distributed caching functionality.

Potential future improvements include:

## Storage

- Persistent Storage
- Snapshot Support
- Append Only File (AOF)
- Write-Ahead Logging

---

## Networking

- gRPC Communication
- TLS Encryption
- Authentication & Authorization
- API Rate Limiting

---

## Cluster Management

- Automatic Service Discovery
- Leader Election
- Dynamic Replica Selection
- Automatic Replica Rebalancing

---

## Observability

- OpenTelemetry
- Distributed Tracing
- Centralized Logging
- Alerting
- Log Aggregation

---

## Deployment

- Kubernetes Deployment
- Helm Charts
- Auto Scaling
- Rolling Updates
- Blue-Green Deployment

---

# Documentation

Detailed project documentation is available in the **docs/** directory.

| Document | Description |
|----------|-------------|
| PRD.md | Functional and non-functional requirements |
| Architecture.md | Overall system architecture |
| Design.md | System design decisions |
| API.md | REST API reference |
| Deployment.md | Deployment guide |
| DeveloperGuide.md | Development workflow |
| Memory.md | Project progress |
| Phases.md | Development roadmap |
| Rules.md | Coding standards |

---

# Contributing

Contributions are welcome.

If you would like to improve the project:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

Please ensure that:

- Code follows the project structure.
- Documentation is updated.
- New features include appropriate testing.
- Existing functionality is not broken.

---

# Frequently Asked Questions

## Why build this instead of using Redis?

Redis already solves distributed caching extremely well. The purpose of this project is educational—to understand and implement the core ideas behind distributed cache systems rather than relying on an existing solution.

---

## Is this production ready?

This project incorporates many production-inspired engineering practices such as containerization, monitoring, replication, and failure recovery. However, it is intended primarily as a learning project and should not be considered a drop-in replacement for mature distributed cache systems.

---

## Does the project support horizontal scaling?

Yes.

The use of Consistent Hashing and Virtual Nodes allows additional cache nodes to be introduced with minimal key redistribution.

---

## Why use Virtual Nodes?

Virtual Nodes improve key distribution across physical cache nodes and help reduce load imbalance within the cluster.

---

## What monitoring tools are used?

The project integrates:

- Prometheus
- Grafana

to collect, store, and visualize operational metrics.

---

# Acknowledgements

This project was inspired by concepts commonly found in distributed caching systems and distributed systems literature.

Special inspiration comes from technologies and ideas such as:

- Redis Cluster
- Consistent Hashing
- Distributed Caching
- Prometheus
- Grafana
- Docker

This project is an independent educational implementation and is not affiliated with or derived from any production caching system.

---

# License

This project is licensed under the **MIT License**.

See the **LICENSE** file for complete details.

---

# Author

**Abhishek Verma**

Backend Developer | Distributed Systems Enthusiast

- GitHub: https://github.com/Abhishhek-Verma
- LinkedIn: https://www.linkedin.com/in/Abhishhek-Verma

---

# Support

If you found this project useful:

- ⭐ Star the repository
- 🍴 Fork the project
- 🛠️ Open an issue for bugs or feature requests
- 💡 Share suggestions for future improvements

Feedback and contributions are always appreciated.

---

# Final Notes

This project was built to explore the design and implementation of distributed caching systems through practical engineering.

It brings together concepts from distributed systems, backend development, DevOps, and observability into a single educational project. The focus is on understanding the internal mechanisms behind scalable and fault-tolerant cache architectures while following clean architecture and production-oriented development practices.
