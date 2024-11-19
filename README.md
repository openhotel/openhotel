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

### Dependencies

- Install `deno >= 1.44`
- Install `node >= 20`
- Install `yarn`

### Install

- Run `deno task install`

### Start project
- Run [Onet](https://github.com/openhotel/onet/releases/latest)
- Run `deno task start`
- If it's the first time you run the project you need to modify `app/server/config.yml`
  - `version: development`
  - `auth: 
       enabled: false`
  - Then run again `deno task start`

---

### TODO: Coding practices

- Enable prettier on save
