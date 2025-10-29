/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

import { Octokit } from "@octokit/rest";
import jwt from "jsonwebtoken";

export async function GET(_req: Request) {
  try {
    //@ts-expect-error fix type later
    const session = await getServerSession(authOptions);

    // Ensure user object with correct type and githubInstallationId
    const user = session?.user as {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubInstallationId?: number | string;
    };

    if (!session || !user || !user.githubInstallationId || !user.email) {
      return NextResponse.json(
        { success: false, message: "Github not connected" },
        { status: 400 },
      );
    }

    // Check if required environment variables are present
    if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
      console.error("Missing GitHub environment variables");
      return NextResponse.json(
        {
          success: false,
          message: "GitHub configuration error",
        },
        { status: 500 },
      );
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
      `POST /app/installations/${user.githubInstallationId}/access_tokens`,
    );

    // Create a new Octokit instance with the installation access token
    const installationOctokit = new Octokit({ auth: data.token });

    // get all repositories for the installation
    const repositories = await installationOctokit.request(`GET /installation/repositories`);
    console.log(repositories.data);

    return NextResponse.json({
      success: true,
      message: "Github connected",
      repositories: repositories.data,
    });
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);

    // Handle specific GitHub API errors
    if (error instanceof Error && error.message.includes("Bad credentials")) {
      return NextResponse.json(
        {
          success: false,
          message: "GitHub authentication failed. Please reconnect your GitHub account.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch repositories",
      },
      { status: 500 },
    );
  }
}
