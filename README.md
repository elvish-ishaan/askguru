
# AskGuru

AskGuru is an AI-powered knowledge assistant and project workspace built with Next.js. It integrates language models, vector search (Qdrant), and a PostgreSQL database (via Prisma) to provide searchable, conversational access to project sources and user-provided content.

## Key features

- Conversational AI powered by LangChain and OpenAI-compatible providers
- Vector embeddings and similarity search using Qdrant
- User authentication via NextAuth
- Project source ingestion and searchable knowledge base
- TypeScript + Next.js (App Router) frontend with Tailwind CSS
- Prisma ORM for PostgreSQL database access

## Tech stack

- Next.js (App Router)
- React 19
- TypeScript
- Prisma + PostgreSQL
- Qdrant (vector database)
- LangChain / OpenAI bindings
- NextAuth for authentication
- Tailwind CSS for UI

## Quickstart (development)

Requirements

- Node.js 18+ (LTS recommended)
- npm, pnpm or yarn (examples use npm)
- Docker (optional, for running local Postgres/Qdrant via docker-compose)

1. Clone the repo

```powershell
git clone https://your-repo-url.git
cd askguru