import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import websocket from "@fastify/websocket";

export const clientConnections: {
  user_id?: number;
  socket: any;
}[] = [];

const websocketPlugin: FastifyPluginAsync = fp(async (fastify) => {
  await fastify.register(websocket);

  fastify.decorate("notifyAllClients", async function (data: any) {
    for (const conn of clientConnections) {
      if (!conn.socket) continue;

      const message = JSON.stringify({ data });
      conn.socket.send(message);
    }
  });

  fastify.decorate("notifyClient", async function (user_id: number, data: any) {
    const socket = clientConnections.find(
      (conn) => conn.user_id === user_id
    )?.socket;
    if (!socket) return;

    const message = JSON.stringify({ data });

    socket.send(message);
  });
});

declare module "fastify" {
  interface FastifyInstance {
    notifyClient(user_id: number, data: any): void;
    notifyAllClients(data: any): void;
  }
}

export default websocketPlugin;
