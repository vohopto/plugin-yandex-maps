import { Plugin } from '@nocobase/server';

const YMAPS_API_KEY = process.env.YANDEX_MAPS_API_KEY || '';

function buildUrl(ep: string, p: Record<string, string>) {
  const u = new URL(`https://${ep}`);
  u.searchParams.set('apikey', YMAPS_API_KEY);
  Object.entries(p).forEach(([k, v]) => u.searchParams.set(k, v));
  return u.toString();
}

async function callY(ep: string, p: Record<string, string>) {
  const r = await fetch(buildUrl(ep, p));
  if (!r.ok) throw new Error(`[Yandex] ${r.status}: ${await r.text()}`);
  return r.json();
}

export class PluginYandexMapsServer extends Plugin {
  async load() {
    this.app.resourcer.define({
      name: 'yandex-geocode',
      actions: {
        list: {
          handler: async (ctx: any) => {
            const a = String(ctx.request.query.address ?? '').trim();
            if (!a) ctx.throw(400, '"address" required');
            ctx.body = await callY('geocode-maps.yandex.ru/1.x/', {
              geocode: a, format: 'json', lang: 'ru_RU'
            });
          },
        },
      },
    });

    this.app.resourcer.define({
      name: 'yandex-suggest',
      actions: {
        list: {
          handler: async (ctx: any) => {
            const q = String(ctx.request.query.query ?? '').trim();
            if (!q) ctx.throw(400, '"query" required');
            ctx.body = await callY('suggest-maps.yandex.ru/v1/suggest', {
              text: q, lang: 'ru_RU'
            });
          },
        },
      },
    });

    this.app.acl.allow('yandex-geocode', '*', 'public');
    this.app.acl.allow('yandex-suggest', '*', 'public');
  }
}

export default PluginYandexMapsServer;
