"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./typeDefs/schema");
const resolvers_1 = require("./resolvers");
const dataLoaders_1 = require("./utils/dataLoaders");
// Cargar variables de entorno
dotenv_1.default.config();
const PORT = process.env.PORT || 8085;
/**
 * Main server function
 */
async function startServer() {
    // Crear Express app y HTTP server
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    // Crear Apollo Server
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
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
    app.use(process.env.GRAPHQL_PATH || '/graphql', (0, cors_1.default)({
        origin: process.env.CORS_ORIGIN?.split(',') || '*',
        credentials: true
    }), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            // Crear DataLoaders frescos para cada request
            const loaders = (0, dataLoaders_1.createDataLoaders)();
            // Obtener token del header
            const authHeader = req.headers.authorization;
            const token = authHeader?.replace('Bearer ', '');
            // Obtener userId si existe en el header
            const userId = req.headers['x-user-id'];
            return {
                loaders,
                token,
                userId
            };
        }
    }));
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
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
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
//# sourceMappingURL=index.js.map