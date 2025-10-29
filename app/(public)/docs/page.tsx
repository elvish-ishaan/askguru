"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Copy, Check, Github, Book, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DocsPage() {
  const [open, setOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("installation");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sections = [
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage" },
    { id: "configuration", label: "Configuration" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const codeBlocks = [
    "npm install askguru",
    "yarn add askguru",
    "import ChatWidget from 'askguru';",
    `<ChatWidget
  config={{
    apiKey: 'YOUR_API_KEY',
    welcomeMessage: 'Hello! How can I help you today?',
    botName: 'AskGuru',
    theme: '#007bff',
    logoImage: 'https://example.com/logo.png',
    apiEndpoint: 'https://www.askguru.ai/api/chat'
  }}
/>`,
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 mt-15">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-72 border-r border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-xl">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3 mb-2">
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div> */}
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent ">
                AskGuru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Documentation</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <nav className="p-4 space-y-2">
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center w-full text-left font-semibold text-sm px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {open ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                <Book className="h-4 w-4 mr-2" />
                Getting Started
              </button>
              {open && (
                <ul className="mt-1 ml-2 space-y-1">
                  <li>
                    <button
                      onClick={() => scrollToSection("installation")}
                      className={`w-full text-left text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeSection === "installation"
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      Installation
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("usage")}
                      className={`w-full text-left text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeSection === "usage"
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      Usage
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => scrollToSection("configuration")}
                      className={`w-full text-left text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeSection === "configuration"
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      Configuration
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="font-semibold text-sm px-3 py-2 flex items-center">
                <Github className="h-4 w-4 mr-2" />
                Resources
              </p>
              <ul className="mt-1 ml-2 space-y-1">
                <li>
                  <button className="w-full text-left text-sm px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                    API Reference
                  </button>
                </li>
                <li>
                  <button className="w-full text-left text-sm px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                    Examples
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Docs Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/60 dark:to-purple-950/60 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 shadow-sm">
              <Zap className="h-3 w-3" />
              v1.0.0
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AskGuru
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              A powerful React component for embedding an AI-powered chat widget into your web
              application. Provides a beautiful, customizable interface for conversational
              interactions.
            </p>
          </div>

          {/* Installation */}
          <section id="installation" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              Installation
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Get started by installing AskGuru via your preferred package manager:
            </p>

            <div className="space-y-4">
              <div className="relative group">
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-lg overflow-x-auto">
                  <code className="text-sm font-mono">npm install askguru</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(codeBlocks[0], 0)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  {copiedIndex === 0 ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-300" />
                  )}
                </button>
              </div>

              <div className="relative group">
                <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-lg overflow-x-auto">
                  <code className="text-sm font-mono">yarn add askguru</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(codeBlocks[1], 1)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  {copiedIndex === 1 ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Usage */}
          <section id="usage" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Usage</h2>

            <div className="space-y-6">
              <div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Import the ChatWidget component in your React app:
                </p>
                <div className="relative group">
                  <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-lg overflow-x-auto">
                    <code className="text-sm font-mono">{codeBlocks[2]}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeBlocks[2], 2)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    {copiedIndex === 2 ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Add the widget to your component tree with configuration:
                </p>
                <div className="relative group">
                  <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-lg overflow-x-auto">
                    <code className="text-sm font-mono whitespace-pre">{codeBlocks[3]}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeBlocks[3], 3)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    {copiedIndex === 3 ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Configuration */}
          <section id="configuration" className="mb-16 scroll-mt-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              Configuration
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The{" "}
              <code className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-sm">
                config
              </code>{" "}
              prop accepts the following options:
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900">
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-slate-100">
                      Option
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-slate-100">
                      Type
                    </th>
                    <th className="text-left p-4 font-semibold text-slate-900 dark:text-slate-100">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-950">
                  <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        apiKey
                      </code>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">string</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs font-medium mr-2">
                        Required
                      </span>
                      Your API key for authentication.
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        welcomeMessage
                      </code>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">string</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      Initial message shown to the user.
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        botName
                      </code>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">string</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      Name displayed for the bot.
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        theme
                      </code>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">string</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      Customize primary/secondary colors.
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        logoImage
                      </code>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">string</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      Customize the icon image.
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        apiEndpoint
                      </code>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">string</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      API endpoint for chat.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Right Side Index */}
      <aside className="hidden xl:block sticky top-0 h-screen w-64 border-l border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 tracking-wide uppercase">
          On this page
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-sm transition-all duration-200 ${
                  activeSection === section.id
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
