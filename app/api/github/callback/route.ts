import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

import { Octokit } from "@octokit/rest";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/dbClient";

export async function GET(req: Request) {
  try {
    //@ts-expect-error fix type later
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.redirect("/auth?error=not-logged-in");
    }

    const { searchParams } = new URL(req.url);
    const installationId = searchParams.get("installation_id");

    if (!installationId) {
      return NextResponse.json({ error: "Missing installation_id" }, { status: 400 });
    }

    // Check if required environment variables are present
    if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
      console.error("Missing GitHub environment variables");
      return NextResponse.redirect("/projects?error=github_config");
    }

    const token = jwt.sign(
      {
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        iss: process.env.GITHUB_APP_ID,
      },
      process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, "\n"),
      { algorithm: "RS256" },
    );

    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.request(
      `POST /app/installations/${installationId}/access_tokens`,
    );

    console.log(data);
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        githubInstallationId: installationId,
      },
    });

    return NextResponse.redirect(new URL("/projects?github_installed=true", req.url));
  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return NextResponse.redirect("/projects?error=github_install_failed");
  }
}
