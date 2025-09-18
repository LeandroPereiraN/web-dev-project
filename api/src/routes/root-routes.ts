import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const rootRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.get('/', {
        schema: {
            tags: ["root"],
            summary: "Verifica el estado de la aplicación",
            description: "Devuelve ok si está funcionando la aplicación",
            response: {
                200: {
                    type: 'object',
                    properties: {
                        root: { type: 'boolean' }
                    }
                }
            }
        },
    }, async (req, res) => {
        return { root: true };
    });
}

export default rootRoutes;