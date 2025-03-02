# OpenHotel Auth

[![Static Badge](https://img.shields.io/badge/CC_BY--NC--SA_4.0-blue?style=for-the-badge&color=gray)](/LICENSE)
![GitHub branch check runs](https://img.shields.io/github/check-runs/openhotel/auth/master?style=for-the-badge)
[![GitHub Release](https://img.shields.io/github/v/release/openhotel/auth?style=for-the-badge)](https://github.com/openhotel/auth/releases/latest)
[![Static Badge](https://img.shields.io/badge/discord-b?style=for-the-badge&logo=discord&color=white)](https://discord.gg/qBZfPdNWUj)

---

- `OHAP`: `OpenHotel Auth Protocol`

Basic example with `OHAP` [/auth-example](https://github.com/openhotel/auth-example)

## How to run the project

You can run OpenHotel Auth either with native installations (Deno + Node) or via Docker.

### Option A: Run Locally (Deno + Node)

If you prefer running without Docker:

#### Install Dependencies
- Deno >= 1.44
- Node >= 20
- Yarn (make sure Corepack is enabled if using Yarn 4)

#### Start project

- Run `deno task install` to install dependencies.
- Run `deno task start` to start the server.
- Set `version` to `development` in the `app/server/config.yml` file.

### Option B: Run with Docker (Development)

#### Install docker
https://docs.docker.com/engine/install/

#### Build and start

```bash
docker compose up --build
```

This will spin up both the server (Deno) and the client (Vite/React) in development mode, with hot reload.

> [!NOTE]
>
> There’s no need to install Deno or Node on your host machine, as Docker handles them.
> By default, the server runs on port 20240, and the client on port 2024. Check or adjust your docker-compose.yml if needed.
> In development mode, changes to your code are automatically reflected without rebuilding the image.
