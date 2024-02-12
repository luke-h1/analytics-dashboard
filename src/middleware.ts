import { NextRequest, NextResponse } from "next/server";
import { analytics } from "./utils/analytics";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    // track an analytics event
    console.log("track");
    try {
      analytics.track("pageview", {
        page: "",
        country: req.geo?.country ?? "unknown",
      });
    } catch (e) {
      console.error(e);
    }
  }
  return NextResponse.next();
}

export const matcher = {
  matcher: ["/"],
};
