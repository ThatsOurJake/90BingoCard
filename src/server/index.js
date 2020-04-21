import path from 'path';
import Koa from 'koa';
import KoaPug from 'koa-pug';
import KoaRouter from 'koa-router';
import mount from 'koa-mount';
import serve from 'koa-static';

import config from './config';
import genCards from './card';
import getDobber from './dobber';

const app = new Koa();
const router = new KoaRouter();

new KoaPug({
  app,
  viewPath: path.join(__dirname, 'views'),
})

app.use(mount('/assets', serve(path.join(__dirname, 'assets'))));

router.get('/', ctx => ctx.render('index', {
  cards: genCards(),
  dobber: getDobber(),
}));

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(`Listening on port: ${config.port}`);
});
