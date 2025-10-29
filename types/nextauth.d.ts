declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      name: string;
      email: string;
      githubInstallationId: string;
    };
  }
}
