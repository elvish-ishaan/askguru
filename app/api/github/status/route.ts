import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    //@ts-expect-error fix type later
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authenticated",
        },
        { status: 401 },
      );
    }

    const user = session.user as {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubInstallationId?: string;
    };

    const isInstalled = !!user.githubInstallationId;

    return NextResponse.json({
      success: true,
      isInstalled,
      installationId: user.githubInstallationId || null,
    });
  } catch (error) {
    console.error("Error checking GitHub status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
