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

const secret = process.env.NODE_ENV === 'development' ? '12345' : randomBytes(32).toString('hex');

const app = new Koa();
const router = new Router();

const token = process.env.TELEGRAM_TOKEN;
const bot = new Bot(token);

const i18n = new I18n({
  defaultLocale: 'en',
  directory: 'locales',
});
bot.use(i18n);

router.get('/app/(.*)', async (ctx) => {
  await send(ctx, './dist/index.html');
});
router.post('/bot/', webhookCallback(bot, 'koa', { secretToken: secret }));

async function auth(ctx, next) {
  if (process.env.NODE_ENV === 'development') {
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
        ctx.user = JSON.parse(initData.get('user'));
        return next();
      }
    }
  }
  return ctx.throw(401);
}

const api = Router({
  prefix: '/api/',
});

// api error handling
api.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      console.error(err);
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.errors.map(item => item.message).join(', '),
      };
    } else {
      console.error(err.stack || err.toString());
      ctx.status = err.status || 500;
      ctx.body = {
        status: 'error',
        message: err.expose ? err.message : 'Internal Server Error',
      };
    }
  }
});

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

app.use(logger());
app.use(bodyParser({
  enableTypes: ['json'],
}));
app.use(mount('/app/assets/', serve('./dist/assets/')));
// Web
app.use(router.routes());
app.use(router.allowedMethods());
// Api
app.use(api.routes());
app.use(api.allowedMethods());

bot.command('start', async (ctx) => {
  await ctx.reply(ctx.t('welcome'));
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

bot.command('help', async (ctx) => {
  await ctx.reply(ctx.t('description'));
});

bot.on('message:text', (ctx) => {
  ctx.reply(`Echo: ${ctx.message.text}`);
});

await bot.api.setWebhook(`https://${process.env.DOMAIN}/bot/`, {
  secret_token: secret,
});

const server = app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0', () => {
  const { address, port } = server.address();
  console.log(`Alerts server launched on '${address}:${port}'`);
});
