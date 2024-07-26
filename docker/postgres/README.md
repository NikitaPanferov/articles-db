# Docker Compose Setup for Development with PostgreSQL and pgAdmin

This README file provides instructions for setting up a development environment using Docker Compose with PostgreSQL as the database and pgAdmin as the database management tool.

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

Your project directory should have the following structure:

```
postgres/
│
├── docker-compose.yml
└── data/
```

- `docker-compose.yml`: Docker Compose configuration file.
- `data/`: Directory to store PostgreSQL data files.

## Docker Compose Configuration

The `docker-compose.yml` file includes the configuration for two services: `db` (PostgreSQL) and `pgadmin` (pgAdmin 4).

```yaml
version: '3.8'
services:
  db:
    container_name: pg_container
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: repo
    volumes:
      - ./data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  pgadmin:
    container_name: pgadmin4_container
    image: dpage/pgadmin4
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: root
    ports:
      - "5050:80"
```

### Services

1. **db**: This service sets up a PostgreSQL database.
    - `container_name`: The name of the PostgreSQL container.
    - `image`: The Docker image to use for the PostgreSQL container.
    - `restart`: Always restart the container unless it is explicitly stopped or Docker itself is stopped.
    - `environment`: Environment variables for PostgreSQL configuration.
        - `POSTGRES_USER`: Username for the PostgreSQL database.
        - `POSTGRES_PASSWORD`: Password for the PostgreSQL database.
        - `POSTGRES_DB`: The name of the default database.
    - `volumes`: Mount the local `data` directory to the container's data directory to persist data.
    - `ports`: Map port 5432 on the host to port 5432 on the container.

2. **pgadmin**: This service sets up pgAdmin 4 for database management.
    - `container_name`: The name of the pgAdmin container.
    - `image`: The Docker image to use for the pgAdmin container.
    - `restart`: Always restart the container unless it is explicitly stopped or Docker itself is stopped.
    - `environment`: Environment variables for pgAdmin configuration.
        - `PGADMIN_DEFAULT_EMAIL`: Default email for pgAdmin login.
        - `PGADMIN_DEFAULT_PASSWORD`: Default password for pgAdmin login.
    - `ports`: Map port 5050 on the host to port 80 on the container.

## Steps to Run

1. **Clone the repository (if applicable)**

   ```sh
   git clone <your-repo-url>
   cd your-project
   ```

2. **Create the `data` directory**

   ```sh
   mkdir data
   ```

3. **Start the services**

   Run the following command in the project directory to start the PostgreSQL and pgAdmin services:

   ```sh
   docker-compose up -d
   ```

   The `-d` flag runs the containers in detached mode.

4. **Access pgAdmin**

   Open your web browser and go to [http://localhost:5050](http://localhost:5050). Log in with the default email (`admin@admin.com`) and password (`root`).

5. **Add a new server in pgAdmin**

   - Click on "Add New Server".
   - In the "General" tab, set the "Name" to whatever you prefer.
   - In the "Connection" tab, use the following details:
     - Host name/address: `db`
     - Port: `5432`
     - Maintenance database: `repo`
     - Username: `root`
     - Password: `root`

6. **Verify the connection**

   Once the server is added, you should be able to connect and manage your PostgreSQL database through pgAdmin.

## Stopping the Services

To stop the running containers, use the following command:

```sh
docker-compose down
```

This will stop and remove the containers but will preserve the data in the `data` directory.

## Cleaning Up

If you want to remove all the containers, networks, and volumes associated with the services, use:

```sh
docker-compose down -v
```

This will also remove the data stored in the `data` directory.

## Conclusion

You now have a development environment with PostgreSQL and pgAdmin set up using Docker Compose. This setup allows you to manage your database efficiently during development.