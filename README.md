# tg-alert

Telegram Mini App **AviaTips Alerts** helps you track flight ticket prices ✈️

Launch the app: [@AviaTipsBot](https://t.me/AviaTipsBot)

**Why use a Mini App?** It offers more convenience for selecting departure and destination, adjusting the day slider, and configuring other parameters within the web application. On the other hand, receiving notifications is simpler and more user-friendly within the main Telegram interface via the bot.

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

`DOMAIN` and `TELEGRAM_TOKEN` environment variables are mandatory for launching the application. You can use any tool instead of `localtunnel` to make your local app public.

## Features

Key features of the Mini App:

- Handling `MainButton` and `BackButton`
- Multilingual support (translations available in `en` and `ru`)
- Color Schemes support 🎨
- Server-side authentication
- It works!

## Development

The web app is implemented using the [Vue](https://vuejs.org/) framework and built with [Vite](https://vitejs.dev/).

To launch API and database:

```bash
NODE_ENV=development
docker compose up
```

Setting `NODE_ENV` to `development` disables telegram signature check for local development.

To launch the development server:

```bash
npm run dev
```

Vite setup to proxy API requests to API server. For local development, mocks of `MainButton`, `BackButton`, and `WebApp.showConfirm` are used.

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

The application uses a PostgreSQL database, and if needed, you can connect to it using any explorer on the standard port 5432.

## Build

To build the production application:

```bash
npm run build
```

## Todo

- [x] Launch Telegram Mini App template
- [x] Launch from Menu Button
- [x] Launch from Inline Button
- [x] Routing
- [x] Color theme support
- [x] MainButton support
- [x] BackButton support
- [x] Fast local text search by 3000+ items
- [x] Search and Select view
- [x] Form view
- [x] i18n in web app
- [x] i18n in bot
- [ ] Price slider
- [ ] Calendar view
- [ ] More languages support

## License

MIT
