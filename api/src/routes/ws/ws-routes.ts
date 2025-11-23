import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { clientConnections } from "../../plugins/ws.js";

const websocketRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "/",
    {
      websocket: true,
      schema: {
        tags: ["WebSocket"],
        summary: "Iniciar la conexion con WS",
        querystring: Type.Object({
          user_id: Type.Optional(Type.Integer({ minimum: 1 })),
        }),
        description:
          "Ruta para iniciar la conexion con WS. No hay requerimientos de uso",
      },
    },
    (socket, req) => {
      const { user_id } = req.query;

      if (user_id) {
        clientConnections.push({ user_id, socket });
      } else {
        clientConnections.push({ socket });
      }

      socket.send(
        JSON.stringify({
          mensaje: "Conectado al servidor",
          id_usuario: user_id,
        })
      );

      socket.on("close", () => {
        const index = clientConnections.findIndex(conn => conn.socket === socket);
        if (index !== -1) {
          clientConnections.splice(index, 1);
        }
      });
    }
  );
};

export default websocketRoute;