# OpenHotel

[![Static Badge](https://img.shields.io/badge/CC_BY--NC--SA_4.0-blue?style=for-the-badge&color=gray)](/LICENSE)
![GitHub branch check runs](https://img.shields.io/github/check-runs/openhotel/openhotel/master?style=for-the-badge)
[![GitHub Release](https://img.shields.io/github/v/release/openhotel/openhotel?style=for-the-badge)](https://github.com/openhotel/openhotel/releases/latest)
[![Static Badge](https://img.shields.io/badge/powered%20by-%F0%9F%8C%B7%20tulip%20engine-red?style=for-the-badge&color=white)](https://github.com/tulipjs/tulip)
[![Static Badge](https://img.shields.io/badge/discord-b?style=for-the-badge&logo=discord&color=white)](https://discord.gg/qBZfPdNWUj)

#### Please read everything before opening an issue, starting a hotel, or running code. Thank you!

## License

`Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International`

### What does that mean?

- This project is open source, you can use, mix or reuse any of the code or assets.
- You cannot use any of the source code or assets material for commercial purposes.
- You cannot monetize any of the work done on this repository, or all the derivative work.
- You must link any of the used, mixed or reused material to this repo.
- You must preserve the `CC BY-NC-SA 4.0` license to all the derivative work.

### Exceptions:

- You can add donations to maintain your own server, and give a custom badge for that (The badge cannot unlock anything more than the badge itself, and it cannot segregate or differentiate the user at any cost or from any way). Only that, no gray zone!
- We can add exceptions for marketing/ad campaigns purposes, ONLY if explicit permission is granted.

---

## Objective of the project:

- Create a virtual Open Hotel social-network/game.
- Gain virtual credits from mini-games inside the game, never pay for anything.
- Be able to create your own Hotel and add your own customization with plugins, configurations, rules...
- Protect the consumer from abusive and speculative companies.

---

## How to run the project

You can run OpenHotel Auth either with native installations (Deno + Node) or via Docker.

If it's the first time running the project:
  - Go to `./app/server/config.yml` and change the `version` to `development`. Restart the process.
  - On the browser, add a localStorage item with key `username` and value of your choice.
  - Reload the browser
  - Go to `./app/server/users.yml` and add the username on the `op` list
  - Go to `Room 1` and use the command `/set flags@pirate 3 3 0 0 20` 🏴‍☠️

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

---

### Build project

- Run `deno task build`

### TODO: Coding practices

- Enable prettier on save
