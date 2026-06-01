import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/prisma/dbClient";
import { Octokit } from "@octokit/rest";
import jwt from "jsonwebtoken";

interface FileContent {
  path: string;
  content: string;
  size: number;
  type: string;
  sha: string;
}

interface TreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    //@ts-expect-error fix type later
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "User not authenticated" },
        { status: 401 },
      );
    }

    const { id: projectId } = await params;

    // Get project with repository
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        //@ts-expect-error fix type later
        userId: session.user.userId,
      },
      include: {
        repository: true,
      },
    });

    if (!project || !project.repository) {
      return NextResponse.json(
        { success: false, message: "Repository not found for this project" },
        { status: 404 },
      );
    }

    // Get user's GitHub installation ID
    const user = session.user as {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubInstallationId?: string;
    };

    if (!user.githubInstallationId) {
      return NextResponse.json(
        { success: false, message: "GitHub not connected" },
        { status: 400 },
      );
    }

    // Check if required environment variables are present
    if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
      console.error("Missing GitHub environment variables");
      return NextResponse.json(
        { success: false, message: "GitHub configuration error" },
        { status: 500 },
      );
    }

    // Create JWT token for GitHub App authentication
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

    // Get installation access token
    const { data } = await octokit.request(
      `POST /app/installations/${user.githubInstallationId}/access_tokens`,
    );

    // Create a new Octokit instance with the installation access token
    const installationOctokit = new Octokit({ auth: data.token });

    // Get repository tree (all files and directories)
    const { data: treeData } = await installationOctokit.request(
      `GET /repos/${project.repository.fullName}/git/trees/main?recursive=1`,
    );

    const files: FileContent[] = [];
    const maxFileSize = 1024 * 1024; // 1MB limit per file
    const maxFiles = 100; // Limit total number of files

    // Process files from the tree
    for (const item of treeData.tree as TreeItem[]) {
      if (files.length >= maxFiles) break;

      // Only process files (not directories) and exclude certain file types
      if (item.type === "blob" && item.size && item.size < maxFileSize) {
        const filePath = item.path;

        // Skip binary files and common non-text files
        const skipExtensions = [
          ".png",
          ".jpg",
          ".jpeg",
          ".gif",
          ".svg",
          ".ico",
          ".webp",
          ".mp4",
          ".avi",
          ".mov",
          ".wmv",
          ".flv",
          ".webm",
          ".mp3",
          ".wav",
          ".flac",
          ".aac",
          ".ogg",
          ".zip",
          ".rar",
          ".7z",
          ".tar",
          ".gz",
          ".pdf",
          ".doc",
          ".docx",
          ".xls",
          ".xlsx",
          ".ppt",
          ".pptx",
          ".exe",
          ".dll",
          ".so",
          ".dylib",
          ".woff",
          ".woff2",
          ".ttf",
          ".eot",
          ".lock",
          ".log",
        ];

        const shouldSkip = skipExtensions.some((ext) => filePath.toLowerCase().endsWith(ext));

        if (shouldSkip) continue;

        try {
          // Get file content
          const { data: fileData } = await installationOctokit.request(
            `GET /repos/${project.repository.fullName}/contents/${filePath}`,
          );

          if (fileData.type === "file" && fileData.content) {
            // Decode base64 content
            const content = Buffer.from(fileData.content, "base64").toString("utf-8");

            files.push({
              path: filePath,
              content: content,
              size: fileData.size,
              type: fileData.type,
              sha: fileData.sha,
            });
          }
        } catch (fileError) {
          console.warn(`Failed to fetch file ${filePath}:`, fileError);
          // Continue with other files
        }
      }
    }

    return NextResponse.json({
      success: true,
      files: files,
      totalFiles: files.length,
      repository: {
        name: project.repository.name,
        fullName: project.repository.fullName,
        language: project.repository.language,
      },
    });
  } catch (error) {
    console.error("Error fetching repository files:", error);

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
      { success: false, message: "Failed to fetch repository files" },
      { status: 500 },
    );
  }
}
