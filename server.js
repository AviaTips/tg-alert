import Koa from 'koa';
import Router from '@koa/router';
import { bodyParser } from '@koa/bodyparser';
import logger from 'koa-logger';
import mount from 'koa-mount';
import { randomBytes } from 'node:crypto';
import send from 'koa-send';
import serve from 'koa-static';

import { I18n } from '@grammyjs/i18n';
import { validateWebAppData } from '@grammyjs/validator';
import { Bot, webhookCallback } from 'grammy';

import { Sequelize } from 'sequelize';
import sequelize from './db/index.js';

// eslint-disable-next-line
import data from './lib/data.js';

// Generate a secret token for webhook security
const secret = process.env.NODE_ENV === 'development' ? '12345' : randomBytes(32).toString('hex');

// Create a Koa application and a router
const app = new Koa();
const router = new Router();

// Retrieve the Telegram Bot token from environment variables
const token = process.env.TELEGRAM_TOKEN;
const bot = new Bot(token);

// Initialize internationalization
const i18n = new I18n({
  defaultLocale: 'en',
  directory: 'locales',
});
bot.use(i18n);

// Serve the web app's HTML file for any route started with /app/
router.get('/app/(.*)', async (ctx) => {
  await send(ctx, './dist/index.html');
});

// Configure the bot's webhook handler
router.post('/bot/', webhookCallback(bot, 'koa', { secretToken: secret }));

// Authentication middleware
async function auth(ctx, next) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, set a mock user for testing
    ctx.user = {
      id: 12345,
      language_code: 'ru',
    };
    return next();
  }
  if (ctx.header['tgwebappdata']) {
    const initData = new URLSearchParams(ctx.header['tgwebappdata']);
    if (validateWebAppData(token, initData)) {
      if (initData.has('user')) {
        // If valid web app data includes a user, set it as the user context
        ctx.user = JSON.parse(initData.get('user'));
        return next();
      }
    }
  }
  // If authentication fails, return a 401 Unauthorized response
  return ctx.throw(401);
}

// Create an API router
const api = Router({
  prefix: '/api/',
});

// Error handling middleware for the API
api.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      // Handle Sequelize validation errors with a 400 Bad Request response
      console.error(err);
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.errors.map(item => item.message).join(', '),
      };
    } else {
      // Handle other errors with a 500 Internal Server Error response
      console.error(err.stack || err.toString());
      ctx.status = err.status || 500;
      ctx.body = {
        status: 'error',
        message: err.expose ? err.message : 'Internal Server Error',
      };
    }
  }
});

// Define an API route to fetch alerts
api.get('alerts', auth, async (ctx) => {
  const alerts = await sequelize.models.Alert.findAll({
    where: { user: ctx.user.id },
    order: [['createdAt', 'DESC']],
  });
  ctx.status = 200;
  ctx.body = {
    status: 'success',
    data: alerts,
  };
});

// Define an API route to create alert
api.post('alerts', auth, async (ctx) => {
  const alert = await sequelize.models.Alert.create({
    ...ctx.request.body,
    user: ctx.user.id,
    language: ctx.user.language_code,
  });
  ctx.status = 201;
  ctx.body = {
    status: 'success',
    data: alert,
  };
  if (process.env.NODE_ENV !== 'development') {
    // In production mode, send a notification to the user via the bot
    try {
      const locale = i18n.locales.includes(ctx.user.language_code) ? ctx.user.language_code : 'en';
      const msg = [
        i18n.t(locale, 'alert-info-direction', {
          origin: data.get(alert.origin).name[locale],
          destination: data.get(alert.destination).name[locale],
        }),
        alert.type === 'oneway' ? i18n.t(locale, 'alert-info-oneway') : i18n.t(locale, 'alert-info-return'),
      ];
      bot.api.sendMessage(ctx.user.id, msg.join(' '));
    } catch (err) {
      console.error(err);
    }
  }
});

// Define an API route to delete alert
api.delete('alerts/:id', auth, async (ctx) => {
  const affected = await sequelize.models.Alert.destroy({
    where: {
      id: ctx.params.id,
      user: ctx.user.id,
    },
  });
  if (affected) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Alert not exists',
    };
  }
});

// Middlewares for logging and parsing request bodies
app.use(logger());
app.use(bodyParser({
  enableTypes: ['json'],
}));

// Serve static assets for the web app
app.use(mount('/app/assets/', serve('./dist/assets/')));

// Web routes
app.use(router.routes());
app.use(router.allowedMethods());

// API routes
app.use(api.routes());
app.use(api.allowedMethods());

// Bot command to start the interaction
bot.command('start', async (ctx) => {
  await ctx.reply(ctx.t('welcome'), {
    reply_markup: {
      inline_keyboard: [[{
        text: ctx.t('create-alert'),
        web_app: {
          url: `https://${process.env.DOMAIN}/app/create/`,
        },
      }]],
    },
  });
  await ctx.setChatMenuButton({
    menu_button: {
      type: 'web_app',
      text: ctx.t('alert'),
      web_app: {
        url: `https://${process.env.DOMAIN}/app/`,
      },
    },
  });
});

// Bot command to provide help information
bot.command('help', async (ctx) => {
  await ctx.reply(ctx.t('description'));
});

// Handle incoming messages in development mode (echo back)
if (process.env.NODE_ENV === 'development') {
  bot.on('message:text', (ctx) => {
    ctx.reply(`Echo: ${ctx.message.text}`);
  });
}

// Set up the bot's webhook
await bot.api.setWebhook(`https://${process.env.DOMAIN}/bot/`, {
  secret_token: secret,
});

// Configure the bot's name, short description, and description for multiple locales
for (const locale of i18n.locales) {
  await bot.api.setMyName(i18n.t(locale, 'name'), {
    language_code: locale,
  });
  await bot.api.setMyShortDescription(i18n.t(locale, 'about'), {
    language_code: locale,
  });
  await bot.api.setMyDescription(i18n.t(locale, 'description'), {
    language_code: locale,
  });
}

// Start the Koa server
const server = app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0', () => {
  const { address, port } = server.address();
  console.log(`Alerts server launched on '${address}:${port}'`);
});
