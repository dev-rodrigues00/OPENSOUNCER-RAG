import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import pino from 'pino';
import { env } from './config/env.js';
import { ragRoutes } from './routes/rag.routes.js';

const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: { colorize: true },
        }
      : undefined,
});

export async function buildServer() {
  const fastify = Fastify({
    logger,
    disableRequestLogging: false,
  });

  // Plugins de Segurança e Infra
  await fastify.register(cors, { origin: '*' });
  await fastify.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Rotas da Aplicação
  await fastify.register(ragRoutes);

  return fastify;
}

async function start() {
  const server = await buildServer();
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
    console.log(`🚀 Enterprise RAG Server rodando em http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}
