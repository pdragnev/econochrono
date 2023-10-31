# EconoChrono Project

## Description

Manage and visualize stock data. Built with the [NestJS](https://nestjs.com/) framework for the backend and React for the frontend.

## Project Structure

- `econochrono-be/`: Contains all backend-related code and configuration.
- `econochrono-fe/`: Contains frontend code.

### Using Docker Compose
- Docker and Docker Compose installed on your system.

To spin up the entire application stack (frontend, backend, and database) using Docker Compose, navigate to the root directory, if you're running the services for the first time and want to initialize the database with data, you need to set the INIT_DB to true environment variable. You can do this by running:

```bash
INIT_DB=true docker-compose up --build -d
```

After the DB and data are initialized INIT_DB is not needed:

```bash
docker-compose up --build -d
```
Shutting down with:
```bash
docker-compose down
```

After starting the services, the frontend will be accessible at http://localhost:3000 and the backend API at http://localhost:3001.

## Local Setup Installation

### Prerequisites
- Node.js and npm installed (for local development).
- Local MySQL Database

### Backend

Navigate to the `econochrono-be` directory:

```bash
cd econochrono-be/
```

Then install the necessary dependencies:

```bash
npm install
```

To run the backend service, we need to set up local MySQl DB first and then execute:

```bash
npx prisma db push
npm run start
```
To generate test data:
```bash
npm run dataInit
```

### Frontend

Navigate to the econochrono-fe directory:

```bash
cd econochrono-fe/
```

Then install the necessary dependencies:

```bash
npm install
```

Start the frontend application with:

```bash
npm run start
```
