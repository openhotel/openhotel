# dev

Run the OpenHotel stack locally from source with Docker (from the old openhotel/devkit).
Apps are mounted from `app/<name>` of this monorepo, so edits reload live.

| Service      | Folder             | URL                   |
| ------------ | ------------------ | --------------------- |
| client       | `app/openhotel`    | http://localhost:1994 |
| auth         | `app/auth`         | http://localhost:2024 |
| web          | `app/web`          | http://localhost:2025 |
| onet         | `app/onet`         | http://localhost:9400 |
| asset-editor | `app/asset-editor` | http://localhost:2030 |
| static       | `app/static`       | http://localhost:1995 |
| s3           | SeaweedFS          | http://localhost:9000 |
| mail         | Mailpit            | http://localhost:8025 |

## Requirements

- Docker
- Deno

## Usage (from the repo root)

```bash
deno task dev:setup            # create dev configs
deno task dev:up auth          # start auth
deno task dev:seed             # create users, hotel and tokens (seed.yml)
deno task dev:up               # everything (in background)
deno task dev:up auth client   # some services
deno task dev:logs client      # logs of one service
deno task dev:down             # stop everything
deno task dev:reset            # remove containers, s3 data and databases
```
