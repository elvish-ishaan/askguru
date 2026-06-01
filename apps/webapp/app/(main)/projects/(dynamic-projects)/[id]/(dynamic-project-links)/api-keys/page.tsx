"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApiKey {
  id: string;
  secret: string;
  projectId: string;
  created_at: string;
}

export default function ApiKeysPage() {
  const { id: projectId } = useParams();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch keys on load
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects/${projectId}/api-keys`);
        const data = await res.json();
        if (!data.success) return;
        setKeys(data?.apikeys);
      } catch (error) {
        console.error("Error fetching API keys:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKeys();
  }, [projectId]);

  const handleGenerateKey = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/projects/${projectId}/api-keys`, {
        method: "POST",
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      if (data.success) {
        setKeys((prev) => [data.apiKey, ...prev]);
      }
    } catch (err) {
      console.error("Error generating key", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const maskSecret = (secret: string) => {
    return `${secret?.slice(0, 8)}${"*".repeat(24)}${secret?.slice(-8)}`;
  };

  return (
    <div className="w-full flex flex-col items-center p-6 gap-6">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Button onClick={handleGenerateKey} disabled={loading}>
          {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
          Generate New API Key
        </Button>
      </div>

      {loading && keys.length === 0 ? (
        <Loader2 className="animate-spin w-6 h-6 text-sitetxtmain" />
      ) : keys.length > 0 ? (
        <div className="w-full max-w-4xl border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Secret Key</TableHead>
                <TableHead className="w-[200px]">Created At</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys?.map((apikey) => (
                <TableRow key={apikey?.id}>
                  <TableCell className="font-mono text-xs">
                    {apikey?.id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {maskSecret(apikey?.secret)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(apikey?.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(apikey?.secret)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedKey === apikey?.secret ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-12">
          <span className="text-gray-400">No API keys found</span>
          <Button onClick={handleGenerateKey} disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            Generate API Key
          </Button>
        </div>
      )}
    </div>
  );
}
