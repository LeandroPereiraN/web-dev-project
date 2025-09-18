import Fastify from 'fastify'
import autoload from '@fastify/autoload'
import type { FastifyInstance, FastifyListenOptions } from 'fastify'
import path from 'node:path'
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastifyListenOptions: FastifyListenOptions = {
  port: parseInt(process.env.FASTIFY_PORT || '3000'),
  host: process.env.FASTIFY_HOST || '0.0.0.0',
}

const fastify: FastifyInstance = Fastify();
await fastify.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
})

await fastify.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  dirNameRoutePrefix: true,
})

fastify.listen(fastifyListenOptions, (err: any) => {
  if (err) {
    fastify.close()
    process.exit(1)
  }
})