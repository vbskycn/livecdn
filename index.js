// index.js

var index_default = {
  async fetch(request, env, ctx) {
    // 解析请求路径
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 如果路径以 /logo/ 开头，则直接返回提示信息，避免消耗 Worker 请求额度
    if (pathname.startsWith('/logo/')) {
      return new Response('【提示】logo资源已迁移，请使用：https://livecdn.zbds.top/logo/*.png 访问。', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    // 正常请求则转发到静态资源服务
    return await env.ASSETS.fetch(request);
  }
};

export {
  index_default as default
};
//# sourceMappingURL=index.js.map
