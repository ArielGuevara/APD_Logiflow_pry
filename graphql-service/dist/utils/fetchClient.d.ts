/**
 * Cliente HTTP genérico para comunicación con servicios REST
 */
export declare class FetchClient {
    private axiosInstance;
    constructor(baseURL: string);
    /**
     * GET request
     */
    get<T>(path: string, params?: Record<string, any>): Promise<T>;
    /**
     * POST request
     */
    post<T, R>(path: string, data: T): Promise<R>;
    /**
     * PUT request
     */
    put<T, R>(path: string, data: T): Promise<R>;
    /**
     * DELETE request
     */
    delete<T>(path: string): Promise<T>;
}
//# sourceMappingURL=fetchClient.d.ts.map