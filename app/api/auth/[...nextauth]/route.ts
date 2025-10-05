
import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";

// Use the NextAuth handler
//@ts-expect-error fix the type later
const handler = NextAuth(authOptions);

// Named exports for HTTP methods
export const GET = handler;
export const POST = handler;
