import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/prisma/dbClient";

interface RepositoryData {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  language?: string;
  private: boolean;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
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
    const repositoryData: RepositoryData = await req.json();

    // Verify that the project belongs to the authenticated user
    const user = session.user as {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId?: string;
    };

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.userId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found or access denied" },
        { status: 404 },
      );
    }

    // Check if repository already exists for this project
    const existingRepository = await prisma.repository.findUnique({
      where: { projectId },
    });

    if (existingRepository) {
      // Update existing repository
      const updatedRepository = await prisma.repository.update({
        where: { projectId },
        data: {
          githubId: repositoryData.id,
          name: repositoryData.name,
          fullName: repositoryData.full_name,
          description: repositoryData.description || null,
          htmlUrl: repositoryData.html_url,
          language: repositoryData.language || null,
          isPrivate: repositoryData.private,
          updated_at: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Repository updated successfully",
        repository: updatedRepository,
      });
    } else {
      // Create new repository
      const newRepository = await prisma.repository.create({
        data: {
          githubId: repositoryData.id,
          name: repositoryData.name,
          fullName: repositoryData.full_name,
          description: repositoryData.description || null,
          htmlUrl: repositoryData.html_url,
          language: repositoryData.language || null,
          isPrivate: repositoryData.private,
          projectId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Repository selected successfully",
        repository: newRepository,
      });
    }
  } catch (error) {
    console.error("Error storing repository:", error);
    return NextResponse.json(
      { success: false, message: "Failed to store repository" },
      { status: 500 },
    );
  }
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

    // Verify that the project belongs to the authenticated user
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

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found or access denied" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      repository: project.repository,
    });
  } catch (error) {
    console.error("Error fetching repository:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch repository" },
      { status: 500 },
    );
  }
}
