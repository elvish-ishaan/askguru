# AskGuru

AskGuru turns any website or documentation into a conversational AI chatbot. Point it at a URL, and it scrapes the content, builds a vector knowledge base, and exposes a chat API your users can talk to — either through the hosted console or an embeddable React widget.

---

## Architecture

```
                        ┌──────────────────────────────────┐
                        │           User / Browser          │
                        └───────────┬──────────────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │        Next.js App (webapp)     │
                    │  ┌─────────────┐  ┌──────────┐ │
                    │  │  App Router │  │ API Routes│ │
                    │  │  (React UI) │  │ (Node.js) │ │
                    │  └─────────────┘  └────┬─────┘ │
                    └───────────────────────┼────────┘
                                            │
              ┌─────────────────────────────┼──────────────────────────┐
              │                             │                          │
   ┌──────────▼──────────┐    ┌────────────▼────────────┐  ┌──────────▼──────────┐
   │     PostgreSQL       │    │        OpenAI            │  │       Pinecone       │
   │  (Users, Projects,   │    │  gpt-4o-mini (chat)      │  │  Vector embeddings   │
   │   Keys, Threads,     │    │  text-embedding-3-small  │  │  Similarity search   │
   │   Usage, Repos)      │    │  (ingestion + search)    │  │  per project         │
   └─────────────────────┘    └─────────────────────────┘  └─────────────────────┘

External consumers:
  ┌────────────────────────────┐
  │  @askguru/sdk (React)      │  <- embeddable chat widget, ships separately
  │  Any HTTP client           │  <- direct API access with API key
  └────────────────────────────┘
```

### Ingestion pipeline

When a project is created, the webapp:
1. Crawls the `sourceUrl` recursively using LangChain's `RecursiveUrlLoader`
2. Strips HTML and splits content into 1 000-character chunks (200-char overlap)
3. Generates embeddings via `text-embedding-3-small` (512 dimensions)
4. Upserts vectors into Pinecone, tagged with the project ID as namespace metadata

### Chat pipeline

On every chat request:
1. API key is validated against the database and resolved to a project
2. The user query is embedded and a similarity search runs against that project's vectors in Pinecone
3. Retrieved context + the query (plus prior conversation history for follow-ups) is sent to `gpt-4o-mini` with a structured system prompt
4. The model returns `{ "text": "...", "source": "..." }` — source attribution included
5. The thread, conversation, and usage counters are persisted in PostgreSQL

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Radix UI, Lucide icons |
| Animation | Framer Motion, GSAP, Three.js |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth | NextAuth v4 (Google, GitHub, credentials) |
| AI / LLM | LangChain, OpenAI (gpt-4o-mini) |
| Embeddings | OpenAI text-embedding-3-small via `@langchain/openai` |
| Vector DB | Pinecone via `@langchain/pinecone` |
| GitHub API | Octokit REST |
| Monorepo | Turborepo + npm workspaces |

---

## Dev setup

### Prerequisites

- Node.js 18+, npm 10+
- Docker (for local Postgres) **or** an external PostgreSQL instance
- OpenAI API key
- Pinecone account + API key
- Google OAuth credentials (optional — needed for Google sign-in)
- GitHub OAuth app (optional — needed for GitHub sign-in and repo integration)

### 1. Install dependencies

```bash
npm install
```

### 2. Start the database

```bash
cd apps/webapp
docker-compose up -d
```

This starts a PostgreSQL container on `localhost:5432`.

### 3. Configure environment

```bash
cp apps/webapp/.env.example apps/webapp/.env
```

Edit `apps/webapp/.env` — see the [Environment variables](#environment-variables) section below.

### 4. Run migrations and generate Prisma client

```bash
cd apps/webapp
npm run db:generate
npm run db:migrate
```

### 5. Start the dev server

From the repo root:

```bash
npm run dev
```

The webapp is available at `http://localhost:3000`.

---

## Environment variables

All variables live in `apps/webapp/.env`.

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | OpenAI API key for LLM and embeddings |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Full base URL of the app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Random secret for NextAuth JWT signing |
| `PINECONE_API_KEY` | Yes | Pinecone API key |
| `PINECONE_INDEX` | Yes | Name of the Pinecone index to use |
| `NEXT_PUBLIC_ASKGURU_API_KEY` | Yes | API key used by the public-facing widget demo |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SEC` | Optional | Google OAuth client secret |
| `AUTH_GITHUB_ID` | Optional | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | Optional | GitHub OAuth app client secret |
| `GITHUB_APP_ID` | Optional | GitHub App ID for repository integration |
| `GITHUB_PRIVATE_KEY` | Optional | GitHub App private key (PEM) |

---

## Authentication

NextAuth is configured with three providers:

- **Google OAuth** — requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SEC`
- **GitHub OAuth** — requires `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
- **Credentials** — email + bcrypt-hashed password stored in PostgreSQL

Sessions use the JWT strategy. The session callback enriches the JWT with the full user record fetched from the database.

---

## API

All public endpoints require an API key issued per project:

```
Authorization: Bearer <api_key>
```

### Chat

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Start a new conversation thread |
| `POST` | `/api/chat/follow-up` | Continue an existing thread |

**Request — `/api/chat`**
```json
{ "query": "How do I reset my password?" }
```

**Request — `/api/chat/follow-up`**
```json
{ "query": "Can you elaborate?", "threadId": "<thread_id>" }
```

**Response (both)**
```json
{
  "text": "To reset your password, go to...",
  "source": "https://docs.example.com/account",
  "threadId": "<thread_id>"
}
```

CORS is open (`*`) on both chat endpoints so the widget can call from any origin.

### Project management (authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/projects/create-project` | Create project and ingest source URL |
| `GET` | `/api/projects` | List projects for the authenticated user |
| `GET` | `/api/projects/[id]` | Get a single project |
| `POST` | `/api/projects/[id]/api-keys` | Generate a new API key |
| `GET` | `/api/projects/[id]/api-keys` | List API keys for a project |

### GitHub integration (authenticated)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/github/status` | Check if GitHub App is connected |
| `GET` | `/api/github/repositories` | List repositories from the connected installation |
| `POST` | `/api/github/callback` | OAuth callback handler |

---

## Embeddable SDK (`@askguru/sdk`)

The `packages/sdk` workspace ships a React chat widget that external sites can drop in.

```tsx
import { ChatWidget } from "@askguru/sdk";

<ChatWidget
  apiKey="your_project_api_key"
  apiEndpoint="https://your-askguru-instance.com/api/chat"
  botName="Support Bot"
  welcomeMessage="Hi! How can I help you today?"
  theme="#6366f1"
/>
```

Build the SDK:

```bash
cd packages/sdk
npm run build
```

Outputs CommonJS, ESM, and TypeScript declarations to `packages/sdk/dist/`.

---

## Monorepo scripts

Run from the repo root via Turborepo:

| Script | Description |
|---|---|
| `npm run dev` | Start all apps in dev mode |
| `npm run build` | Build all apps and packages |
| `npm run lint` | Lint all packages |

Run from `apps/webapp` for database operations:

| Script | Description |
|---|---|
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Create and apply a new migration (dev) |
| `npm run db:deploy` | Apply pending migrations (production) |
