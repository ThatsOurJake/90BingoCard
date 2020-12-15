import path from 'path';
import Koa from 'koa';
import KoaPug from 'koa-pug';
import KoaRouter from 'koa-router';
import mount from 'koa-mount';
import serve from 'koa-static';
import Cache from 'node-cache';
import { nanoid } from 'nanoid';

import config from './config';
import genCards from './card';
import getDobber from './dobber';

const app = new Koa();
const router = new KoaRouter();
const cache = new Cache({
  deleteOnExpire: true,
  stdTTL: 7200 // 2h
});

new KoaPug({
  app,
  viewPath: path.join(__dirname, 'views'),
  locals: {
    host: config.host,
  },
})

app.use(mount('/assets', serve(path.join(__dirname, 'assets'))));

router.get('/', ctx => {
  const uuid = nanoid(10);
  const cards = genCards();

  cache.set(uuid, cards.map(x => x.getNumbers()));

  return ctx.render('index', {
    cards,
    dobber: getDobber(),
    uuid,
  })
});

router.get('/dashboard', ctx => ctx.render('dashboard'));

router.get('/api/dashboard', ctx => {
  ctx.body = cache.keys().map(key => ({ userId: key, cards: cache.get(key)}));
});

router.post('/leave/:id', ctx => {
  cache.del(ctx.params.id);
  ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(`Listening on port: ${config.port}`);
});
