# DENIS RODRIGUES
**Desenvolvedor Full Stack Sênior / Pleno | Especialista em Node.js, TypeScript & RAG / IA Generativa**
📍 Brasil | GitHub: [github.com/dev-rodrigues00](https://github.com/dev-rodrigues00) | Portfólio Open Source: [github.com/dev-rodrigues00/-Enterprise-RAG-OPENSOUNCER](https://github.com/dev-rodrigues00/-Enterprise-RAG-OPENSOUNCER)

---

## 🎯 RESUMO PROFISSIONAL
Desenvolvedor Full Stack com sólida vivência prática em arquitetura de microsserviços de alta performance, orquestração de **Inteligência Artificial Generativa** e sistemas **RAG (Retrieval-Augmented Generation)** de nível corporativo. Experiência comprovada na criação de infraestruturas escaláveis e resilientes utilizando **Node.js, TypeScript, Fastify/Express, LangChain e PostgreSQL com pgvector**.

Especialista em pipelines de busca híbrida (Dense + Sparse/BM25), fusão de rankings (RRF), algoritmos de reranking, processamento multiformato (PDF, DOCX, CSV) e streaming em tempo real via **Server-Sent Events (SSE)**. Conhecimento aprofundado em observabilidade corporativa (Pino, Prometheus, OpenTelemetry), validação estrita com **Zod**, suítes de testes automatizados com **Vitest/Jest** e esteiras de **CI/CD no GitHub Actions**.

---

## 🛠️ STACK TECNOLÓGICA & HABILIDADES

- **Linguagens & Runtimes:** JavaScript (ES6+), TypeScript (5.x), Node.js (20+), Python.
- **Frameworks Backend:** Fastify, Express.js, NestJS. Design de APIs RESTful, WebSockets, gRPC e Server-Sent Events (SSE).
- **Inteligência Artificial & RAG:** LangChain, LangGraph, pgvector, Busca Híbrida (BM25 + Cosine Distance), Reciprocal Rank Fusion (RRF), Cross-Encoder Reranking, Recursive Character Chunking, OpenAI API, Ollama (Local bge-m3 / Llama 3), DeepSeek.
- **Bancos de Dados & Caching:** PostgreSQL 16+ (pgvector, índices HNSW e GIN tsvector), Redis (Cache, Rate Limiting, BullMQ), Supabase.
- **Qualidade, Testes & CI/CD:** Vitest, Jest, Cobertura V8, GitHub Actions (Postgres em containers nos runners), ESLint, Prettier.
- **Observabilidade & Resiliência:** Pino (Logs JSON estruturados), Prometheus (`/metrics`), OpenTelemetry (Spans de rastreamento distribuído), `@fastify/rate-limit`, Validação de Schemas com **Zod**.
- **Frontend & Interfaces:** React.js, Next.js, TailwindCSS, gerenciamento de estado complexo e consumo de streams em tempo real.
- **DevOps & Infraestrutura:** Docker, Docker Compose, Linux, Nginx (Reverse Proxy, Load Balancing), PgBouncer.

---

## 💼 EXPERIÊNCIA PROFISSIONAL & PROJETOS DE DESTAQUE

### Arquiteto de Software & Engenheiro RAG / IA | Projetos Independentes & P&D
*2022 – Presente*

- **Enterprise RAG Node.js Engine (Open Source - [github.com/dev-rodrigues00/-Enterprise-RAG-OPENSOUNCER](https://github.com/dev-rodrigues00/-Enterprise-RAG-OPENSOUNCER)):**
  - Concepção e desenvolvimento de uma infraestrutura RAG corporativa de alto rendimento utilizando **Node.js, Fastify, TypeScript, LangChain e PostgreSQL 16 (pgvector)**.
  - Implementação de pipeline de ingestão multiformato assíncrono para PDFs, DOCX, TXTs e CSVs com extração de metadados e segmentação semântica com janelas de overlap.
  - Engenharia de **Busca Híbrida** combinando recuperação semântica vetorial (HNSW) com busca lexical (GIN/BM25) unificadas via **Reciprocal Rank Fusion (RRF)** e filtro por Cross-Encoder Reranker.
  - Arquitetura multi-provedor permitindo chaveamento dinâmico entre modelos em nuvem (OpenAI/DeepSeek) e modelos locais on-premise (**Ollama bge-m3**).
  - Desenvolvimento de endpoint de chat com geração token-a-token via **SSE (Server-Sent Events)** com controle de backpressure e latência sub-segundo.
  - Implementação de observabilidade enterprise com logs estruturados **Pino**, métricas **Prometheus**, rate-limiting no **Fastify** com **Redis** e validação com **Zod**.
  - Criação de suíte de testes com **Vitest** e pipeline automatizada de CI/CD via **GitHub Actions** com banco de dados vetorial integrado.

- **Plataformas de Microsserviços, Automação Distribuída & APIs de Alta Carga:**
  - Desenvolvimento de sistemas distribuídos de mensageria assíncrona com **Node.js, TypeScript e Redis/BullMQ**, processando fluxos de alta concorrência com baixa latência.
  - Criação de middlewares e gateways com proteção anti-DDoS, rate-limiting inteligente por IP/Token e validação rigorosa de payloads antes da persistência em banco de dados.
  - Implementação de painéis administrativos e dashboards reativos em **React.js e Next.js** com comunicação bidirecional via WebSockets.

---

## 🚀 DIFERENCIAIS TÉCNICOS

1. **Domínio de RAG em Nível de Produção:** Compreensão aprofundada de por que buscas vetoriais isoladas falham em cenários reais e como a busca híbrida + RRF + Reranker resolve precisão lexical e semântica.
2. **Mentalidade Pragmática & Orientada a Resultados:** Capacidade de levar produtos da concepção à produção com arquiteturas limpas, código testável, tipagem estrita em TypeScript e documentação técnica impecável.
3. **Foco em Segurança e Observabilidade:** Aplicação nativa de boas práticas de segurança (HTTPS outbound, segredos protegidos por `.env`, validação de contratos de API) e monitoramento contínuo de métricas.

---
