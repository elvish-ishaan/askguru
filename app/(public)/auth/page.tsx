"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Github, Mail, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });
      if (!res?.ok) {
        setError("invalid credentials");
        return;
      }
      router.push("/projects");
    } catch (error) {
      console.log(error, "err in auth");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side: Auth Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center relative overflow-hidden bg-[#0a0a0e] px-6">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at top left, rgba(155,139,255,0.15), transparent 60%),
        radial-gradient(circle at bottom right, rgba(255,154,139,0.1), transparent 70%),
        linear-gradient(180deg, #0a0a0e 0%, #0b0b10 60%, #000 100%)
      `,
            backgroundBlendMode: "overlay",
          }}
        />
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#9B8BFF]/15 blur-[90px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#FF9A8B]/10 blur-[100px] rounded-full" />

        {/* Auth Card */}
        <Card className="relative z-10 w-full max-w-md border border-[var(--border)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_35px_rgba(155,139,255,0.15)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center font-numans text-xl font-bold text-[var(--foreground)]">
              <h1>
                Welcome back to{" "}
                <span className="bg-gradient-to-r from-[#9B8BFF] to-[#FF9A8B] bg-clip-text text-transparent text-3xl">
                  AskGuru
                </span>
              </h1>
              {error && <span className=" text-red-500 text-sm">{error}</span>}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Email
                </label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email || ""}
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent border-[var(--border)] focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                  Password
                </label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password || ""}
                  type="password"
                  placeholder="********"
                  required
                  className="w-full bg-transparent border-[var(--border)] focus:border-[var(--accent)]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 border-[var(--border)] hover:border-[var(--accent)] transition-all"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/projects",
                    redirect: false,
                  })
                }
              >
                <Mail className="h-4 w-4" />
                Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 border-[var(--border)] hover:border-[var(--accent)] transition-all"
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/projects",
                    redirect: false,
                  })
                }
              >
                <Github className="h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side: Gradient Background */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at top left, rgba(155,139,255,0.4), transparent 60%),
        radial-gradient(circle at bottom right, rgba(255,154,139,0.3), transparent 60%),
        linear-gradient(180deg, #0f0c29 0%, #1a1a40 40%, #000 100%)
      `,
            backgroundBlendMode: "overlay",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#9B8BFF] via-[#B19EEF] to-[#FF9A8B] bg-clip-text text-transparent drop-shadow-lg animate-pulse cursor-default">
              AskGuru
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-md mx-auto leading-relaxed cursor-default">
            Empower your platform with an AI chatbot and auto-generated documentation built directly
            from your source code.
          </p>
        </div>

        {/* Soft Glow */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-[#9B8BFF]/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FF9A8B]/20 blur-[140px] rounded-full" />
      </div>
    </div>
  );
}
