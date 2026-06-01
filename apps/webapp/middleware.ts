import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  console.log('middleware called....')
  const res = NextResponse.next()

  res.headers.set("Access-Control-Allow-Origin", "*")
  res.headers.set("Access-Control-Allow-Methods", "GET, POST,DELETE, OPTIONS")
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")


  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: res.headers })
  }

  return res
}

export const config = {
  matcher: ["/api/chat", "/api/chat/follow-up"]
}
