# HYROX Production Deployment

## Required services

- API service from `Dockerfile.api`
- Web service from `Dockerfile.web`
- Railway Postgres database

## API environment variables

- `DATABASE_URL`: Railway Postgres connection URL
- `JWT_SECRET`: long random secret
- `WEB_ORIGIN`: deployed web URL
- `NODE_ENV`: `production`

## Web environment variables

- `NEXT_PUBLIC_API_URL`: deployed API URL

## Railway sequence

1. `railway login`
2. Create a Railway project.
3. Add a Postgres database.
4. Add an API service using `Dockerfile.api`.
5. Add a Web service using `Dockerfile.web`.
6. Set the API variables above.
7. Set the Web variables above.
8. Deploy both services.

The API container runs `prisma db push` on startup so the production Postgres schema is created before the server starts.
