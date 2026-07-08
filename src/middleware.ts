import { auth } from "@/auth";

// 中间件：除了登录页和静态资源，其他页面都要登录
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isApi = req.nextUrl.pathname.startsWith("/api");

  // 未登录访问非登录页 → 跳到登录页
  if (!isLoggedIn && !isLoginPage && !isApi) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // 已登录访问登录页 → 跳到首页
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }
});

// 哪些路径触发中间件
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (图标)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
