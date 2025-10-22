# 🚀 Microservices-Based Social Media Backend

This project is a scalable **Social Media Backend** built using **Microservices Architecture**. It divides functionality across multiple independent services — User, Post, Media, and Search — all connected via **RabbitMQ** for communication and **Redis** for caching. The system runs in **Docker containers** orchestrated through **Docker Compose**, making it easy to build, deploy, and scale.

---

## 🏗️ Architecture Overview

- **API Gateway Service:** Routes and manages incoming requests to internal microservices.  
- **User Service:** Manages authentication, user registration, login, and profile data.  
- **Post Service:** Handles post creation.  
- **Media Service:** Manages file uploads and media storage.  
- **Search Service:** Enables quick post and user searches.  
- **Redis:** Used for caching and session management.  
- **RabbitMQ:** Facilitates asynchronous message-based communication between services.

---

## 🔧 Tech Stack

| Component | Technology |
|------------|-------------|
| Backend Framework | Node.js (Express) |
| Message Broker | RabbitMQ |
| Cache | Redis |
| Database | MongoDB |
| Containerization | Docker, Docker Compose |
| Communication | REST + Message Queue |

---

## ⚙️ Features

- Decoupled microservices with isolated responsibilities  
- Event-driven communication with RabbitMQ  
- Redis caching for optimized data performance  
- Centralized API Gateway for routing and load control  
- Fully containerized multi-service setup  
- Quick local deployment and scaling with Docker Compose  

---

## 🐳 Setup and Installation

Clone the project, configure services, and run everything with Docker.

### 1. Clone Repository

```bash
git clone https://github.com/Sai-Srevan2004/Mini-Socila-media-microservices-nodejs.git
```
after cloning go to each service directory and run

### Run the command
 ```bash
 npm install
```
### Create Dockerfile in each service folder and make sure redis on your system is installed and also rabbitMQ installed before installing rabbitMQ make sure erlin is installed. And create a Docker-compose file in main root directory.

### 2. Create Environment Files

Each service requires both `.env` (for local development) and `.env.docker` (for Docker containerization) files.

#### API Gateway (`api-gateway/.env`)

```env
PORT=3000
ACCESS_TOKEN_SECRET=your_access_token_secret
USER_SERVICE_URL=http://localhost:3001
MEDIA_SERVICE_URL=http://localhost:3002
POST_SERVICE_URL=http://localhost:3003
SEARCH_SERVICE_URL=http://localhost:3004
```

#### API Gateway (`api-gateway/.env.docker`)

```env
PORT=3000
ACCESS_TOKEN_SECRET=your_access_token_secret
USER_SERVICE_URL=http://user-service:3001
MEDIA_SERVICE_URL=http://media-service:3002
POST_SERVICE_URL=http://post-service:3003
SEARCH_SERVICE_URL=http://search-service:3004
```

#### User Service (`user-service/.env`)

```env
PORT=3001
ACCESS_TOKEN_SECRET=your_access_token_secret
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/DB_NAME (or) Direct Atlas URL
```

#### User Service (`user-service/.env.docker`)

```env
PORT=3001
ACCESS_TOKEN_SECRET=your_access_token_secret
REDIS_URL=redis://redis:6379
MONGO_URI=mongodb://mongo:27017/DB_NAME (or) Direct Atlas URL
```

#### Media Service (`media-service/.env`)

```env
PORT=3002
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RABBITMQ_URL=amqp://localhost:5672
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/DB_NAME (or) Direct Atlas URL
```

#### Media Service (`media-service/.env.docker`)

```env
PORT=3002
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RABBITMQ_URL=amqp://rabbitmq:5672
REDIS_URL=redis://redis:6379
MONGO_URI=mongodb://mongo:27017/DB_NAME (or) Direct Atlas URL
```

#### Post Service (`post-service/.env`)

```env
PORT=3003
RABBITMQ_URL=amqp://localhost:5672
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/DB_NAME (or) Direct Atlas URL
```

#### Post Service (`post-service/.env.docker`)

```env
PORT=3003
RABBITMQ_URL=amqp://rabbitmq:5672
REDIS_URL=redis://redis:6379
MONGO_URI=mongodb://mongo:27017/DB_NAME (or) Direct Atlas URL
```

#### Search Service (`search-service/.env`)

```env
PORT=3004
RABBITMQ_URL=amqp://localhost:5672
MONGO_URI=mongodb://localhost:27017/DB_NAME (or) Direct Atlas URL
```

#### Search Service (`search-service/.env.docker`)

```env
PORT=3004
RABBITMQ_URL=amqp://rabbitmq:5672
MONGO_URI=mongodb://mongo:27017/DB_NAME (or) Direct Atlas URL
```

> **Note:** The `.env` files are used for local development, while `.env.docker` files are used when running services in Docker containers. Docker uses service names (like `rabbitmq`, `redis`, `mongo`) for internal networking instead of `localhost`.

### 3. Start All Containers

```bash
docker-compose up --build
```

This will start:
- API Gateway
- User Service
- Post Service
- Media Service
- Search Service
- RabbitMQ
- Redis

### 4. Verify Running Containers

```bash
docker ps
```

All containers should show a healthy state.

---

## 📦 Project Structure

```
├── api-gateway/
│   ├── src/
│   └── Dockerfile
├── user-service/
│   ├── src/
│   └── Dockerfile
├── post-service/
│   ├── src/
│   └── Dockerfile
├── media-service/
│   ├── src/
│   └── Dockerfile
├── search-service/
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Future Enhancements

- Integrate **Elasticsearch** for advanced search.
- Add **GraphQL Gateway** support.
- Implement **service discovery** with Consul.
- Add **Kubernetes orchestration** for scaling.
- Set up **CI/CD pipelines** with GitHub Actions.

---

## 💡 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`feature/your-feature`)
3. Commit your updates
4. Submit a Pull Request

---

## 🧑‍💻 Author

**Sai Srevan**  
Full-Stack Developer | MERN • Docker • Microservices  
📧 https://github.com/Sai-Srevan2004

---

## 🪪 License

Licensed under the **MIT License** — you are free to use, modify, and distribute this project.
