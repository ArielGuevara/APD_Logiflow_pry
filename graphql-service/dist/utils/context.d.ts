import DataLoader from 'dataloader';
import { Usuario, Vehiculo, Factura } from '../entities';
/**
 * Tipo para los DataLoaders del contexto
 */
export interface DataLoaders {
    usuarioLoader: DataLoader<string, Usuario | null>;
    vehiculoLoader: DataLoader<string, Vehiculo | null>;
    facturaLoader: DataLoader<string, Factura | null>;
}
/**
 * Contexto de GraphQL que se pasa a cada resolver
 */
export interface GraphQLContext {
    loaders: DataLoaders;
    token?: string;
    userId?: string;
}
//# sourceMappingURL=context.d.ts.map