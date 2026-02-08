import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { typeDefs } from './typeDefs/schema';
import { resolvers } from './resolvers';
import { createDataLoaders } from './utils/dataLoaders';
import { GraphQLContext } from './utils/context';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 8085;

/**
 * Main server function
 */
async function startServer() {
    // Crear Express app y HTTP server
    const app = express();
    const httpServer = http.createServer(app);

    // Crear Apollo Server
    const server = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        introspection: process.env.ENABLE_INTROSPECTION !== 'false',
        formatError: (error) => {
            console.error('[GraphQL Error]:', error);
            return {
                message: error.message,
                locations: error.locations,
                path: error.path,
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            };
        }
    });

    // Iniciar Apollo Server
    await server.start();

    // Middlewares
    app.use(
        process.env.GRAPHQL_PATH || '/graphql',
        cors({
            origin: process.env.CORS_ORIGIN?.split(',') || '*',
            credentials: true
        }),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }): Promise<GraphQLContext> => {
                // Crear DataLoaders frescos para cada request
                const loaders = createDataLoaders();

                // Obtener token del header
                const authHeader = req.headers.authorization;
                const token = authHeader?.replace('Bearer ', '');

                // Obtener userId si existe en el header
                const userId = req.headers['x-user-id'] as string;

                return {
                    loaders,
                    token,
                    userId
                };
            }
        })
    );

    // Health check
    app.get('/health', (_req, res) => {
        res.json({
            status: 'UP',
            service: 'GraphQL Service',
            timestamp: new Date().toISOString()
        });
    });

    // Info endpoint
    app.get('/', (_req, res) => {
        res.json({
            service: 'LogiFlow GraphQL Service',
            version: '1.0.0',
            graphqlEndpoint: process.env.GRAPHQL_PATH || '/graphql',
            healthCheck: '/health',
            documentation: 'See ENDPOINTS.md for query examples'
        });
    });

    // Start server
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

    console.log('');
    console.log('🚀 LogiFlow GraphQL Service is running!');
    console.log('');
    console.log(`📍 Server ready at http://localhost:${PORT}`);
    console.log(`🔍 GraphQL endpoint: http://localhost:${PORT}${process.env.GRAPHQL_PATH || '/graphql'}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log('');
    console.log('External services:');
    console.log(`  - Auth Service: ${process.env.AUTH_SERVICE_URL}`);
    console.log(`  - Pedido Service: ${process.env.PEDIDO_SERVICE_URL}`);
    console.log(`  - Fleet Service: ${process.env.FLEET_SERVICE_URL}`);
    console.log(`  - Billing Service: ${process.env.BILLING_SERVICE_URL}`);
    console.log('');
}

// Start the server
startServer().catch((error) => {
    console.error('❌ Error starting server:', error);
    process.exit(1);
});
