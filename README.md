# Microservice Server(CI/CD with jenkins)

A lightweight microservices-based system built with Node.js, Express, MongoDB, and RabbitMQ, fully containerized with Docker.
The project includes an automated CI/CD pipeline powered by Jenkins, also running inside Docker, which builds, tests, and deploys all microservices using Docker images.

This setup demonstrates a real-world microservice architecture with event-driven communication, centralized pipeline automation, and seamless containerized deployment.

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

## Build

### Build the docker
```bash
git clone https://github.com/curator-me/microservice-server.git
cd microservice-server
docker compose up -d
```
---

### Build & Run

There are **two** parts to building this project:

1. **Running the Microservices (Docker Compose)**
2. **Running Jenkins CI/CD (also in Docker)**

---

## 1 Build & Run Microservices

These commands run all services: User, Task, Notification, RabbitMQ.

```bash
git clone https://github.com/curator-me/microservice-server.git
cd microservice-server

# Start all microservices
docker compose up -d
```

Check containers:

```bash
docker compose ps
```

Rebuild after changes:

```bash
docker compose up -d --build
```

---

## 2 Build & Run Jenkins (CI/CD Pipeline)

This project includes a Jenkins setup that is fully Dockerized.

### Start Jenkins

From inside the project directory:

```bash
docker compose -f jenkins-compose.yml up -d
```

Jenkins will be available at:

```
http://localhost:8080
```

---

### Configure Pipeline

Jenkins automatically fetches your `Jenkinsfile` from the GitHub repo.

Steps:

1. Open Jenkins → **New Item**
2. Select **Pipeline**
3. Choose **Pipeline from SCM**
4. Enter the repo URL
   `https://github.com/curator-me/microservice-server.git`
5. Save → **Build Now**

The pipeline will:

* Checkout code
* Install Node dependencies
* Run tests
* Run services 


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
