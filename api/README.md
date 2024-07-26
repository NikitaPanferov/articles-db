# FastAPI API backend

This README file provides instructions for setting up, running, and developing a FastAPI API backend.

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- [Python 3.12+](https://www.python.org/downloads/)
- [Poetry](https://python-poetry.org/docs/#installation) (for dependency management)

## Project Structure

The project directory is structured as follows:

```
api/
│
├── alembic/               # Alembic migration scripts
├── alembic.ini            # Alembic configuration file
├── certs/                 # SSL certificates (if any)
├── configs/                # Configuration files
├── .env                   # Environment variables
├── .env.template          # Template for environment variables
├── main.py                # Entry point of the application
├── models/                # Database models
├── poetry.lock            # Poetry lock file
├── pyproject.toml         # Poetry configuration file
├── repositories/          # Database repositories
├── routers/               # API route handlers
├── schemas/               # Pydantic models (schemas)
├── services/              # Business logic
└── README.md              # This README file
```

## Setup

1. **Install dependencies**

   Use Poetry to install project dependencies:

   ```sh
   poetry install
   ```

2. **Set up environment variables**

   Create a `.env` file by copying `.env.template` and updating it with your configuration if needed (`.env.template` can be used for default environment variables):

   ```sh
   cp .env.template .env
   ```

   Update the `.env` file with your specific environment variables.

4. **Apply database migrations**

   If you're using Alembic for database migrations, apply the migrations to set up the database schema:

   ```sh
   poetry run alembic upgrade head
   ```

## Running the Application

To run the FastAPI application, use the following command:

```sh
poetry run uvicorn main:app --reload
```

This will start the development server on [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Project Configuration

### Alembic

Alembic is used for database migrations. Configuration is in the `alembic.ini` file, and migration scripts are in the `alembic/` directory.

To create a new migration, use:

```sh
poetry run alembic revision --autogenerate -m "Your migration message"
```

To apply migrations, use:

```sh
poetry run alembic upgrade head
```

### Environment Variables

Environment variables are managed using a `.env` file. Ensure that your `.env` file is correctly set up before running the application. Use the `.env.template` as a reference.

### SSL Certificates

To generate certificates, follow the [instructions](certs/README.md)

## Project Structure Details

- **main.py**: Entry point of the FastAPI application. It includes the application setup and route inclusion.
- **models/**: Contains the SQLAlchemy models representing the database schema.
- **repositories/**: Contains repository classes for database interactions.
- **routers/**: Contains route handlers (APIs) for different endpoints.
- **schemas/**: Contains Pydantic models for request and response validation.
- **services/**: Contains the business logic for the application.

## Development

### Data Base

To deploy the database for development, follow the [instructions](../docker/postgres/README.md)

### Code Formatting

To maintain code quality, use the following tools:

- **black**: For code formatting.

Run the following command to format and lint the code:

```sh
poetry run black .
```
