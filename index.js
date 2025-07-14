import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export default {
  async fetch(request, env, ctx) {
    try {
      return await getAssetFromKV({ request, waitUntil: ctx.waitUntil });
    } catch (e) {
      return new Response("资源未找到或出错", { status: 404 });
    }
  }
}
