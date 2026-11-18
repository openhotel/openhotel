# OpenHotel

[![Static Badge](https://img.shields.io/badge/CC_BY--NC--SA_4.0-blue?style=for-the-badge&color=gray)](/LICENSE)
[![GitHub branch check runs](https://img.shields.io/github/check-runs/openhotel/openhotel/master?style=for-the-badge)](./CHECKS.md)
[![GitHub Release](https://img.shields.io/github/v/release/openhotel/openhotel?style=for-the-badge)](https://github.com/openhotel/openhotel/releases/latest)
[![release](https://img.shields.io/github/actions/workflow/status/openhotel/openhotel/release.yml?style=for-the-badge&label=release)](./CHECKS.md)
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

// TODO

#### Install Dependencies

- Deno >= 2.9.x
- Node >= 22.x.x
- Yarn (make sure Corepack is enabled if using Yarn 4)

#### Start project

// TODO

# devkit

Run all OpenHotel stack locally with Docker.

| Service      | Repo                     | URL                   |
| ------------ | ------------------------ | --------------------- |
| client       | `openhotel/openhotel`    | http://localhost:1994 |
| auth         | `openhotel/auth`         | http://localhost:2024 |
| web          | `openhotel/web`          | http://localhost:2025 |
| onet         | `openhotel/onet`         | http://localhost:9400 |
| asset-editor | `openhotel/asset-editor` | http://localhost:2030 |
| static       | `openhotel/static`       | http://localhost:1995 |
| s3           | SeaweedFS                | http://localhost:9000 |
| mail         | Mailpit                  | http://localhost:8025 |

## Requirements

- Docker
- Deno
- Git

The service repos are cloned next to this one (or in `REPOS_DIR` from `.env`):

```
openhotel/
├── devkit/
├── openhotel/
├── auth/
├── onet/
├── web/
├── asset-editor/
└── static/
```

## Usage

```bash
deno task dev:setup                # clone missing repos and create dev configs
deno task dev:up auth              # start auth
deno task dev:seed                 # create users, hotel and tokens (seed.yml)
deno task dev:up                   # everything (in background)
deno task dev:up auth client       # some services
deno task dev:logs                 # logs of all services
deno task dev:logs client          # logs of one service
deno task dev:down                 # stop everything
deno task dev:reset                # remove containers, s3 data and databases
deno task dev:reset --configs      # ...and the service configs
deno task dev:reset --cache        # ...and the deno cache
```

## S3

```yaml
s3:
  enabled: true
  endpoint: localhost
  port: 9000
  useSSL: false
  accessKey: openhotel
  secretKey: openhotel
  region: us-east-1
  bucket: <service-name>
```
