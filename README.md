# ⚡ Enterprise RAG Node.js — Production-Ready Hybrid Search Engine

<p align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" alt="divider" />
</p>

<p align="center">
  <strong>High-throughput, enterprise-grade Retrieval-Augmented Generation (RAG) backend engineered with Node.js, Fastify, TypeScript, LangChain, and PostgreSQL + pgvector.</strong>
</p>

<p align="center">
  <a href="#-arquitetura-do-sistema-deep-dive"><img src="https://img.shields.io/badge/Architecture-Hybrid%20RAG-blueviolet?style=for-the-badge&logo=diagramsdotnet" alt="Architecture" /></a>
  <a href="#-qualidade-testes--cicd"><img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI/CD" /></a>
  <a href="#-observabilidade--rate-limiting"><img src="https://img.shields.io/badge/Observability-Pino%20%7C%20Prometheus%20%7C%20OTel-F5A623?style=for-the-badge" alt="Observability" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative" alt="License: MIT" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-v4-000000?style=flat-square&logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/PostgreSQL-16%2B%20%2B%20pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL pgvector" />
  <img src="https://img.shields.io/badge/Tests-Vitest%20%2B%20Coverage-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/OpenAI-Embeddings%20%26%20LLM-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Ollama-Local%20BGE--M3-000000?style=flat-square&logo=ollama&logoColor=white" alt="Ollama" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📌 Visão Geral & Proposta de Valor

O **Enterprise RAG Node** é uma infraestrutura de orquestração **Retrieval-Augmented Generation (RAG)** de nível corporativo e código aberto. Projetado para sanar as principais dores de sistemas generativos em produção: alucinação de LLMs, busca vetorial isolada imprecisa, falta de suporte a arquivos multiformato e ausência de streaming de baixa latência.

Conecta de forma agnóstica qualquer modelo de linguagem (**OpenAI, DeepSeek, Claude, Ollama local**) a bases de conhecimento corporativas dinâmicas com **Busca Híbrida (Lexical BM25 + pgvector HNSW)** e **Reciprocal Rank Fusion (RRF)**.

---

## 🏛️ Arquitetura do Sistema (Deep Dive)

```text
+---------------------------------------------------------------------------------------------------------+
|                                    CLIENTS / APPS / DASHBOARD CONSUMERS                                 |
|                               (Web App, Mobile, Agentes Autônomos, IDE Plugin)                         |
+---------------------------------------------------------------------------------------------------------+
                                                     │
                                                     │ HTTP REST / SSE Stream (Auth Bearer + Rate Limit)
                                                     ▼
+---------------------------------------------------------------------------------------------------------+
|                                    ENTERPRISE RAG NODE ENGINE (Fastify)                                 |
|                                                                                                         |
|  +─────────────────────────+   +─────────────────────────+   +───────────────────────────────────────+  |
|  |   Ingestion Pipeline    |   |    RAG Query Engine     |   |       Enterprise Observability        |  |
|  |  • Multi-format Parsers |   |  • Query Preprocessor   |   |  • Pino Structured JSON Logs          |  |
|  |  • Recursive Chunker    |   |  • Multi-Provider Router|   |  • Prometheus /metrics Endpoint       |  |
|  |  • Metadata Extractor   |   |  • Context Synthesizer  |   |  • OpenTelemetry Traces Spans         |  |
|  +─────────────────────────+   +─────────────────────────+   +───────────────────────────────────────+  |
|                                                                                                         |
|  +───────────────────────────────────────────────────────────────────────────────────────────────────+  |
|  |                                  HYBRID RETRIEVER & RERANKER CORE                                 |
|  |     Dense Embeddings (Cosine Similarity)  +  Sparse Lexical (PostgreSQL tsvector / BM25)           |
|  |                      └───► Reciprocal Rank Fusion (RRF) ───► Cross-Encoder Rerank                 |
|  +───────────────────────────────────────────────────────────────────────────────────────────────────+  |
+---------------------------------------------------------------------------------------------------------+
                                 │                                               │
               Vetorização & SQL │ (Intra-Cluster)                LLM Inferences │ HTTPS (Outbound Only)
                                 ▼                                               ▼
+--------------------------------------------------+       +----------------------------------------------+
|        DATABASE LAYER (PostgreSQL 16)            |       |           LLM & EMBEDDING PROVIDERS          |
|                                                  |       |                                              |
|  • Extension: pgvector                           |       |  • OpenAI (text-embedding-3-small, GPT-4o)   |
|  • Table: documents (Metadata JSONB)             |       |  • DeepSeek API (v3 / R1 reasoning)          |
|  • Table: document_chunks (1536d / 1024d)        |       |  • Ollama Local On-Premise (BGE-M3, Llama 3) |
|  • Index 1: HNSW (vector_cosine_ops)             |       |  • Anthropic Claude (Opus / Sonnet)          |
|  • Index 2: GIN (Portuguese / English tsvector)  |       |                                              |
+--------------------------------------------------+       +----------------------------------------------+
```

---

## 🧠 Diagrama de Sequência Detalhado (RAG Workflow)

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuário / Cliente
    participant API as Fastify Backend
    participant Ingest as Pipeline Ingestão
    participant DB as PostgreSQL + pgvector
    participant LLM as Provedor LLM / Ollama

    Note over User, DB: FASE 1: Ingestão e Vetorização
    User->>API: POST /api/ingest (Arquivo PDF/DOCX)
    API->>Ingest: Extrai texto e divide em Chunks
    Ingest->>LLM: Gera Vetores (Embeddings bge-m3 / text-embedding-3)
    LLM-->>Ingest: Vetores calculados (1536 dimensões)
    Ingest->>DB: Salva Chunks + Embeddings + TSVector

    Note over User, LLM: FASE 2: Consulta e Streaming em Tempo Real
    User->>API: POST /api/chat { query, stream: true }
    API->>LLM: Gera Embedding da Query do usuário
    LLM-->>API: Query Vector
    par Busca Híbrida Concorrente
        API->>DB: Busca Vetorial (Índice HNSW)
        API->>DB: Busca Textual (Índice GIN / BM25)
    end
    DB-->>API: Retorna Top Chunks
    API->>API: RRF Fusion + Reranking (Context Selection)
    API->>LLM: Prompt Aumentado [Contexto + Pergunta]
    LLM-->>API: Stream de Tokens Gerados (SSE)
    API-->>User: Streaming contínuo via Server-Sent Events
```

---

## 🛡️ Validação de Schemas com Zod

Todas as entradas da API são estritamente validadas em tempo de execução para evitar injeção e payloads malformados:

```typescript
import { z } from 'zod';

export const ChatQuerySchema = z.object({
  query: z
    .string({ required_error: 'A query do usuário é obrigatória.' })
    .min(3, 'A query deve ter no mínimo 3 caracteres.')
    .max(2000, 'A query excedeu o limite de 2000 caracteres.'),
  topK: z.number().int().min(1).max(20).default(5),
  similarityThreshold: z.number().min(0).max(1).default(0.7),
  stream: z.boolean().default(true),
  filter: z.record(z.any()).optional(),
});
```

---

## 📊 Observabilidade & Rate Limiting

### 1. Logs Estruturados com Pino (JSON)
Formatação JSON para ingestão direta no Datadog, Grafana Loki ou AWS CloudWatch:
```json
{"level":30,"time":1711932000000,"pid":1420,"reqId":"req-a1","msg":"Query processed in 142ms","topK":5,"chunksRetrieved":5}
```

### 2. Métricas Prometheus (`/metrics`)
- `rag_query_duration_seconds`: Latência da busca híbrida e LLM.
- `rag_chunks_ingested_total`: Total de chunks processados.
- `http_requests_total`: Contagem de requisições por status code.

### 3. Rate Limiting com `@fastify/rate-limit`
Proteção contra abusos e custos inesperados de API:
- **Limite:** 100 requisições / minuto por IP / Token.
- **Armazenamento:** Em memória local ou distribuído via **Redis**.

---

## 🧪 Qualidade, Testes & CI/CD

### Pipeline GitHub Actions (`.github/workflows/ci.yml`)
Cada `push` ou `pull request` executa validação completa em container com PostgreSQL e pgvector nativo:
- **Typecheck**: `tsc --noEmit`
- **Unit & Integration Tests**: `vitest run --coverage`

```bash
# Executar a suíte de testes com cobertura
npm run test:coverage
```

**Resultado de Cobertura:**
```text
 ✓ tests/unit/chunking.test.ts (1 test) 12ms
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   94.28 |    88.88 |     100 |   94.28 |                   
 chunking/         |     100 |      100 |     100 |     100 |                   
 embeddings/       |   91.66 |    80.00 |     100 |   91.66 | 42-45             
-------------------|---------|----------|---------|---------|-------------------
```

---

## ⚙️ Guia de Execução Rápida

### 1. Instalação & Variáveis de Ambiente
```bash
git clone https://github.com/seu-usuario/enterprise-rag-node.git
cd enterprise-rag-node
npm install
cp .env.example .env
```

### 2. Inicialização da Infraestrutura
```bash
docker compose up -d
```

### 3. Executando a Aplicação
```bash
# Modo de desenvolvimento
npm run dev

# Rodando os testes
npm test
```

---

## 🛡️ Licença

Distribuído sob a licença **MIT Open Source**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  <sub>Construído por <strong>Dev Rodrigues</strong> • Arquitetura Enterprise RAG 2026. 🚀</sub>
</p>
