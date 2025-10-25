"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlugZap, Loader2, Github, CheckCircle, ExternalLink, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

interface GitHubStatus {
  success: boolean;
  isInstalled: boolean;
  installationId?: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description?: string;
  private: boolean;
  language?: string;
}

interface RepositoriesResponse {
  success: boolean;
  repositories?: {
    repositories: Repository[];
  };
  message?: string;
}

export default function IntegrationsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [selectingRepo, setSelectingRepo] = useState<number | null>(null);

  const checkGitHubStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/github/status");
      const data = await response.json();
      setGithubStatus(data);
    } catch (error) {
      console.error("Error checking GitHub status:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSelectedRepository = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/repository`);
      const data = await response.json();

      if (data.success && data.repository) {
        setSelectedRepo({
          id: data.repository.githubId,
          name: data.repository.name,
          full_name: data.repository.fullName,
          description: data.repository.description,
          html_url: data.repository.htmlUrl,
          language: data.repository.language,
          private: data.repository.isPrivate,
        });
      }
    } catch (error) {
      console.error("Error checking selected repository:", error);
    }
  }, [projectId]);

  useEffect(() => {
    checkGitHubStatus();
    checkSelectedRepository();

    // Check for GitHub installation success message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("github_installed") === "true") {
      setShowSuccessMessage(true);
      // Refresh the status to show updated connection
      setTimeout(() => {
        checkGitHubStatus();
      }, 1000);
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [projectId, checkGitHubStatus, checkSelectedRepository]);

  const handleConnectGitHub = () => {
    if (githubStatus?.isInstalled) {
      // If already installed, open modal to show repositories
      setError(null);
      setIsModalOpen(true);
      fetchRepositories();
    } else {
      // If not installed, redirect to GitHub app installation
      window.location.href = "https://github.com/apps/askguru-ai/installations/new";
    }
  };

  const fetchRepositories = async () => {
    setReposLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/github/repositories");
      const data: RepositoriesResponse = await response.json();

      if (data.success && data.repositories) {
        setRepositories(data.repositories.repositories);
      } else {
        setError(data.message || "Failed to fetch repositories");
        console.error("Failed to fetch repositories:", data.message);
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error fetching repositories:", error);
    } finally {
      setReposLoading(false);
    }
  };

  const handleSelectRepository = async (repo: Repository) => {
    setSelectingRepo(repo.id);
    try {
      const response = await fetch(`/api/projects/${projectId}/repository`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(repo),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedRepo(repo);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        setError(data.message || "Failed to select repository");
      }
    } catch (error) {
      setError("Network error. Please try again.");
      console.error("Error selecting repository:", error);
    } finally {
      setSelectingRepo(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] px-6 py-12">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>
              {selectedRepo
                ? "Repository selected successfully!"
                : "GitHub successfully connected!"}
            </span>
          </div>
        </div>
      )}
      <Card className="max-w-lg w-full border border-[var(--border)] bg-[var(--card)] shadow-lg text-center p-8">
        <CardContent className="flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--muted)]">
            <PlugZap className="h-8 w-8 text-[var(--primary)] animate-pulse" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold tracking-tight">Integrations Coming Soon</h1>

          {/* Subtext */}
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            We&apos;re working on bringing seamless integrations with your favorite tools. Stay
            tuned for powerful new connections that will make your workflow even smoother.
          </p>

          {/* Status */}
          <div className="flex items-center gap-2 text-[var(--primary)] font-medium">
            <Loader2 className="h-5 w-5 animate-spin" />
            In Progress
          </div>

          {/* Placeholder badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["Slack", "Zapier", "Notion", "Google Drive", "GitHub"].map((name) => (
              <span
                key={name}
                className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--muted)] text-[var(--muted-foreground)]"
              >
                {name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GitHub Integration Card */}
      <Card className="max-w-lg w-full border border-[var(--border)] bg-[var(--card)] shadow-lg text-center p-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Checking status...</span>
            </div>
          ) : githubStatus?.isInstalled ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>GitHub Connected</span>
            </div>
          ) : (
            <div className="text-[var(--muted-foreground)]">
              Connect your GitHub account to access repositories
            </div>
          )}

          {selectedRepo && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Selected Repository</span>
              </div>
              <div className="text-sm text-green-600">
                <div className="font-medium">{selectedRepo.name}</div>
                {selectedRepo.description && (
                  <div className="text-xs mt-1 opacity-75">{selectedRepo.description}</div>
                )}
              </div>
            </div>
          )}

          <Button onClick={handleConnectGitHub} disabled={loading} className="w-full">
            <Github className="h-4 w-4 mr-2" />
            {githubStatus?.isInstalled ? "View Repositories" : "Connect GitHub"}
          </Button>
        </CardContent>
      </Card>

      {/* Repositories Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>GitHub Repositories</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {reposLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading repositories...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-600 mb-2">{error}</div>
                <Button onClick={fetchRepositories} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            ) : repositories.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {repositories.map((repo) => (
                  <Card key={repo.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{repo.name}</h3>
                        {repo.description && (
                          <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {repo.language && (
                            <span className="text-xs px-2 py-1 bg-[var(--muted)] rounded">
                              {repo.language}
                            </span>
                          )}
                          {repo.private && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                              Private
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant={selectedRepo?.id === repo.id ? "default" : "outline"}
                          onClick={() => handleSelectRepository(repo)}
                          disabled={selectingRepo === repo.id}
                          className="min-w-[80px]"
                        >
                          {selectingRepo === repo.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : selectedRepo?.id === repo.id ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(repo.html_url, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--muted-foreground)]">
                No repositories found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer note */}
      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        Have an integration in mind? Let us know!
      </p>
    </div>
  );
}
