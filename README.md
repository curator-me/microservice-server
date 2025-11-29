# Microservice Server

A microservices-based application with RabbitMQ message queueing and MongoDB + Node.js.


## Services

- **Task Service** (Port 3002) - Create and manage tasks
- **User Service** (Port 3001) - User management  
- **Notification Service** - Processes task events via RabbitMQ
- **RabbitMQ** (Port 5672, Management UI: 15672) - Message broker
- **MongoDB** (Port 27017) - Database

---

## Tech Stack

- **Node.js** + **Express.js** – Backend runtime & framework
- **JavaScript** – Service implementation
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **RabbitMQ** – Message broker for async communication
- **Docker + Docker Compose** – Containerization & orchestration

---

## Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Run

```bash
git clone https://github.com/curator-me/microservice-server.git
cd microservice-server
docker compose up -d
```

## API Endpoints

### User Service
- **Create User**
  ```
  POST http://localhost:3001/users
  ```

- **Get All Users**
  ```
  GET http://localhost:3001/users
  ```

### Task Service
- **Create Task**
  ```
  POST http://localhost:3002/tasks/add
  ```

- **Get All Tasks**
  ```
  GET http://localhost:3002/tasks
  ```

## Commands

```
# Check running services
docker compose ps

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild and restart
docker compose up -d --build
```
