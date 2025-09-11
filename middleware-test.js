export { auth as middleware } from "@/lib/auth";

export const config = {
  // הגן על הכול חוץ ממשאבים סטטיים ו-API/auth
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|public|login).*)"]
};
