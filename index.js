addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const ASSET_BASE = ["/index.html", "/404.html", "/logo/"];

async function handleRequest(request) {
  const url = new URL(request.url);
  let pathname = url.pathname;

  // 根路径重定向到index.html
  if (pathname === "/") {
    pathname = "/index.html";
  }

  // 只允许访问index.html、404.html和logo目录下的文件
  if (
    pathname === "/index.html" ||
    pathname === "/404.html" ||
    pathname.startsWith("/logo/")
  ) {
    try {
      const asset = await fetchAsset(pathname);
      if (asset) {
        return asset;
      }
    } catch (e) {
      // 资源读取失败，返回404
    }
  }

  // 兜底返回404.html
  const notFound = await fetchAsset("/404.html");
  return new Response(notFound ? await notFound.arrayBuffer() : "404 Not Found", {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}

async function fetchAsset(pathname) {
  // 兼容Cloudflare Worker的静态资源读取
  // __STATIC_CONTENT_MANIFEST由wrangler自动注入
  try {
    // @ts-ignore
    const manifest = __STATIC_CONTENT_MANIFEST ? JSON.parse(__STATIC_CONTENT_MANIFEST) : {};
    // @ts-ignore
    const assetKey = manifest[pathname] || pathname.replace(/^\//, "");
    // @ts-ignore
    if (typeof __STATIC_CONTENT !== 'undefined') {
      // @ts-ignore
      const asset = await __STATIC_CONTENT.get(assetKey, { type: "arrayBuffer" });
      if (asset) {
        return new Response(asset, {
          status: 200,
          headers: { "Content-Type": getContentType(pathname) }
        });
      }
    }
  } catch (e) {}
  return null;
}

function getContentType(pathname) {
  if (pathname.endsWith(".html")) return "text/html; charset=utf-8";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
} 