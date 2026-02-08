import axios, { AxiosInstance } from 'axios';

/**
 * Cliente HTTP genérico para comunicación con servicios REST
 */
export class FetchClient {
    private axiosInstance: AxiosInstance;

    constructor(baseURL: string) {
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    }

    /**
     * GET request
     */
    async get<T>(path: string, params?: Record<string, any>): Promise<T> {
        try {
            console.log(`[HTTP GET] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.get<T>(path, { params });
            return response.data;
        } catch (error: any) {
            console.error(`[HTTP GET ERROR] ${path}:`, error.message);
            throw new Error(`Failed to fetch from ${path}: ${error.message}`);
        }
    }

    /**
     * POST request
     */
    async post<T, R>(path: string, data: T): Promise<R> {
        try {
            console.log(`[HTTP POST] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.post<R>(path, data);
            return response.data;
        } catch (error: any) {
            console.error(`[HTTP POST ERROR] ${path}:`, error.message);
            throw new Error(`Failed to POST to ${path}: ${error.message}`);
        }
    }

    /**
     * PUT request
     */
    async put<T, R>(path: string, data: T): Promise<R> {
        try {
            console.log(`[HTTP PUT] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.put<R>(path, data);
            return response.data;
        } catch (error: any) {
            console.error(`[HTTP PUT ERROR] ${path}:`, error.message);
            throw new Error(`Failed to PUT to ${path}: ${error.message}`);
        }
    }

    /**
     * DELETE request
     */
    async delete<T>(path: string): Promise<T> {
        try {
            console.log(`[HTTP DELETE] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.delete<T>(path);
            return response.data;
        } catch (error: any) {
            console.error(`[HTTP DELETE ERROR] ${path}:`, error.message);
            throw new Error(`Failed to DELETE ${path}: ${error.message}`);
        }
    }
}
