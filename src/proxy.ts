import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { hasClerkServerConfig } from "@/lib/clerk-config";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/settings(.*)"]);
const hasClerkConfig = hasClerkServerConfig();

function fallbackProxy(request: NextRequest) {
  if (isProtectedRoute(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

const clerkProxy = clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
});

export default hasClerkConfig ? clerkProxy : fallbackProxy;

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
