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
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-600/10 border border-green-400/30 text-green-300 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md transition-all">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-sm font-medium">
            {selectedRepo ? "Repository selected successfully!" : "GitHub successfully connected!"}
          </span>
        </div>
      )}

      {/* GitHub Integration Card */}
      <Card className="max-w-lg w-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl text-center p-8 rounded-2xl">
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
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span>GitHub Connected</span>
            </div>
          ) : (
            <div className="text-gray-400">Connect your GitHub account to access repositories</div>
          )}

          {selectedRepo && (
            <div className="p-4 rounded-xl border border-green-400/30 bg-green-500/10 backdrop-blur-sm text-left transition-all">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Selected Repository</span>
              </div>
              <div className="text-sm text-green-300">
                <div className="font-semibold">{selectedRepo.name}</div>
                {selectedRepo.description && (
                  <div className="text-xs mt-1 opacity-80">{selectedRepo.description}</div>
                )}
              </div>
            </div>
          )}

          <Button
            onClick={handleConnectGitHub}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90 text-white transition-all duration-300 shadow-md"
          >
            <Github className="h-4 w-4 mr-2" />
            {githubStatus?.isInstalled ? "View Repositories" : "Connect GitHub"}
          </Button>
        </CardContent>
      </Card>

      {/* Repositories Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#1b2233] border border-white/10 text-white rounded-2xl max-w-2xl max-h-[80vh] overflow-hidden shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-2">GitHub Repositories</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {reposLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-300">
                <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                <span className="ml-2 text-sm">Loading repositories...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">{error}</div>
                <Button
                  onClick={fetchRepositories}
                  variant="outline"
                  size="sm"
                  className="border-white/10 hover:bg-white/10 text-gray-200"
                >
                  Try Again
                </Button>
              </div>
            ) : repositories.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {repositories.map((repo) => (
                  <Card
                    key={repo.id}
                    className="p-4 bg-[#1f283b] hover:bg-[#232c42] transition-all border border-white/10 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{repo.name}</h3>
                        {repo.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {repo.language && (
                            <span className="text-xs px-2 py-1 bg-white/10 rounded">
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
                          className={`min-w-[80px] ${
                            selectedRepo?.id === repo.id
                              ? "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-400/20"
                              : "border-white/10 hover:bg-white/10 text-gray-200"
                          }`}
                        >
                          {selectingRepo === repo.id ? (
                            <Loader2 className="h-3 w-3 animate-spin text-gray-200" />
                          ) : selectedRepo?.id === repo.id ? (
                            <>
                              <Check className="h-3 w-3 mr-1" /> Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(repo.html_url, "_blank")}
                          className="border-white/10 hover:bg-white/10 text-gray-200"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">No repositories found</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer note */}
      <p className="mt-8 text-sm text-gray-500 opacity-70 hover:opacity-100 transition">
        Have an integration in mind? <span className="underline cursor-pointer">Let us know!</span>
      </p>
    </div>
  );
}
