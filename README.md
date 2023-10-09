# tg-alert

Telegram Mini App **AviaTips Alerts** helps you track flight ticket prices ✈️

Launch the app: [@AviaTipsBot](https://t.me/AviaTipsBot)

## Quick Start

```bash
# Set environment variables
DOMAIN=mydomain.loca.lt
TELEGRAM_TOKEN=your-token

# Install dependencies and build the web app
npm install
npm run build

# Launch the server
docker compose build
docker compose up

# Make the app publicly available as HTTPS
npx localtunnel --port 3000 --subdomain mydomain
```

## Features

Key features of the Mini App:

- Handling `MainButton` and `BackButton`
- Multilingual support (translations available in `en` and `ru`)
- Color Schemes support 🎨
- Server-side authentication
- It works!

## Development

The web app is implemented using the [Vue](https://vuejs.org/) framework and built with [Vite](https://vitejs.dev/).

To launch the development server:

```bash
npm run dev
```

File structure:

```
/src - source code of the web app
    /components/BackButton.vue - Implementation of the Telegram Web Apps BackButton in Vue
    /components/MainButton.vue - Implementation of the Telegram Web Apps MainButton in Vue
    /components/*.vue - Other reusable components
    /views/*.vue - Application views
    /i18n.js - Internationalization logic
    /main.js - Application routing logic
/server.js - Static server, API server, and Bot-related code
```

## Build

To build the production application:

```bash
npm run build
```

## License

MIT
