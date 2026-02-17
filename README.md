# Products Microservice

## Dev

- Clonar repositorio
- Instalar dependecias
- Crear archivo `.env` con las variables de entorno basado en `.env.template`
- Ejecutar migración de prima `pnpm dlx prisma migrate dev`
- Levantar el servidor de NATS:

  ```bash
    docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
  ```

- Ejecutar `npm run start:dev`
