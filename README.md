<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Teslo API

1. Clone project
2. ```pnpm install```
3. Clone the ```.env.example``` file and rename it to ```.env```
4. Change environment variables
5. Build and up database
```
docker-compose -f docker-compose.dev.yaml up --build -d
```
6. Run project: ```pnpm run start:dev```

7. Execute SEED
```
http://localhost:3000/api/v1/seed
```

