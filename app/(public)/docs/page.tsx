"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DocsPage() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] p-4 flex flex-col">
        <ScrollArea className="flex-1">
          <nav className="space-y-4">
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center w-full text-left font-medium text-sm"
              >
                {open ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                Introduction
              </button>
              {open && (
                <ul className="mt-2 ml-6 space-y-2 text-sm text-[var(--muted-foreground)]">
                  <li>Overview</li>
                  <li>Installation</li>
                  <li>Usage</li>
                  <li>Configuration</li>
                </ul>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">Developer Tools</p>
              <ul className="mt-2 ml-6 space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>API Reference</li>
                <li>Examples</li>
              </ul>
            </div>
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Docs Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">AskGuru</h1>
          <p className="text-lg text-[var(--muted-foreground)] mb-8">
            AskGuru is a React component for embedding an AI-powered chat widget into your web application. It provides
            a simple interface for interacting with your website or webapp in a conversational manner.
          </p>

          {/* Installation */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Installation</h2>
          <pre className="bg-[var(--muted)] text-[var(--foreground)] p-4 rounded-lg mb-4">
            <code>npm install askguru</code>
          </pre>
          <pre className="bg-[var(--muted)] text-[var(--foreground)] p-4 rounded-lg">
            <code>yarn add askguru</code>
          </pre>

          {/* Usage */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Usage</h2>
          <p className="mb-4">Import the ChatWidget component in your React app:</p>
          <pre className="bg-[var(--muted)] text-[var(--foreground)] p-4 rounded-lg mb-4">
            <code>{`import ChatWidget from 'askguru';`}</code>
          </pre>
          <p className="mb-4">Add the widget to your component tree:</p>
          <pre className="bg-[var(--muted)] text-[var(--foreground)] p-4 rounded-lg mb-4 overflow-x-auto">
            <code>{`<ChatWidget
  config={{
    apiKey: 'YOUR_API_KEY',
    welcomeMessage: 'Hello! How can I help you today?',
    botName: 'AskGuru',
    theme: '#007bff',
    logoImage: 'https://example.com/logo.png',
    apiEndpoint: 'https://your-api-endpoint.com/chat'
  }}
/>`}</code>
          </pre>

          {/* Configuration */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Configuration</h2>
          <p className="mb-4">The <code>config</code> prop accepts the following options:</p>
          <table className="w-full border-collapse border border-[var(--border)] mb-6">
            <thead>
              <tr className="bg-[var(--muted)]">
                <th className="border border-[var(--border)] p-2 text-left">Option</th>
                <th className="border border-[var(--border)] p-2 text-left">Type</th>
                <th className="border border-[var(--border)] p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[var(--border)] p-2">apiKey</td>
                <td className="border border-[var(--border)] p-2">string</td>
                <td className="border border-[var(--border)] p-2">Required. Your API key for authentication.</td>
              </tr>
              <tr>
                <td className="border border-[var(--border)] p-2">welcomeMessage</td>
                <td className="border border-[var(--border)] p-2">string</td>
                <td className="border border-[var(--border)] p-2">Initial message shown to the user.</td>
              </tr>
              <tr>
                <td className="border border-[var(--border)] p-2">botName</td>
                <td className="border border-[var(--border)] p-2">string</td>
                <td className="border border-[var(--border)] p-2">Name displayed for the bot.</td>
              </tr>
              <tr>
                <td className="border border-[var(--border)] p-2">theme</td>
                <td className="border border-[var(--border)] p-2">string</td>
                <td className="border border-[var(--border)] p-2">Customize primary/secondary colors.</td>
              </tr>
              <tr>
                <td className="border border-[var(--border)] p-2">logoImage</td>
                <td className="border border-[var(--border)] p-2">string</td>
                <td className="border border-[var(--border)] p-2">Customize the icon image.</td>
              </tr>
              <tr>
                <td className="border border-[var(--border)] p-2">apiEndpoint</td>
                <td className="border border-[var(--border)] p-2">string</td>
                <td className="border border-[var(--border)] p-2">API endpoint for chat.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Right Side Index */}
      <aside className="hidden lg:block w-64 border-l border-[var(--border)] bg-[var(--card)] p-4">
        <h3 className="text-sm font-semibold mb-3">On this page</h3>
        <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
          <li>Installation</li>
          <li>Usage</li>
          <li>Configuration</li>
        </ul>
      </aside>
    </div>
  )
}
