import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";

export default fastifyPlugin(async function (fastify) {
  fastify.register(fastifyCors, {
    origin: [
      "http://localhost:3000",
      "http://localhost:4200",
      "https://localhost",
    ],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
  });
});
