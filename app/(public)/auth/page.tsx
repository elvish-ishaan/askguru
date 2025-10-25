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
      <div className="flex w-full md:w-1/2 items-center justify-center bg-[var(--background)] px-6">
        <Card className="w-full max-w-md border bg-[var(--card)] shadow-lg">
          <CardHeader>
            <CardTitle className="text-center font-numans text-xl font-bold text-[var(--foreground)]">
              <h1>
                Welcome back to <span className=" text-primary text-3xl">AskGuru</span>
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
                  className="w-full"
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
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
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
                className="w-full flex items-center gap-2"
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
              linear-gradient(180deg, 
                rgba(245,245,220,1) 0%, 
                rgba(255,223,186,0.8) 25%, 
                rgba(255,182,193,0.6) 50%, 
                rgba(147,112,219,0.7) 75%, 
                rgba(72,61,139,0.9) 100%
              ),
              radial-gradient(circle at 30% 20%, rgba(255,255,224,0.4) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(72,61,139,0.6) 0%, transparent 70%),
              radial-gradient(circle at 50% 60%, rgba(147,112,219,0.3) 0%, transparent 60%)
            `,
          }}
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            <span className=" text-5xl bg-white rounded-md text-primary px-3 shadow font-numans">
              AskGuru
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-md mx-auto">
            Empower your website with smart, conversational AI. Sign in and start your journey
            today.
          </p>
        </div>
      </div>
    </div>
  );
}
