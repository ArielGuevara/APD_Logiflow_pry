"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchClient = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * Cliente HTTP genérico para comunicación con servicios REST
 */
class FetchClient {
    constructor(baseURL) {
        this.axiosInstance = axios_1.default.create({
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
    async get(path, params) {
        try {
            console.log(`[HTTP GET] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.get(path, { params });
            return response.data;
        }
        catch (error) {
            console.error(`[HTTP GET ERROR] ${path}:`, error.message);
            throw new Error(`Failed to fetch from ${path}: ${error.message}`);
        }
    }
    /**
     * POST request
     */
    async post(path, data) {
        try {
            console.log(`[HTTP POST] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.post(path, data);
            return response.data;
        }
        catch (error) {
            console.error(`[HTTP POST ERROR] ${path}:`, error.message);
            throw new Error(`Failed to POST to ${path}: ${error.message}`);
        }
    }
    /**
     * PUT request
     */
    async put(path, data) {
        try {
            console.log(`[HTTP PUT] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.put(path, data);
            return response.data;
        }
        catch (error) {
            console.error(`[HTTP PUT ERROR] ${path}:`, error.message);
            throw new Error(`Failed to PUT to ${path}: ${error.message}`);
        }
    }
    /**
     * DELETE request
     */
    async delete(path) {
        try {
            console.log(`[HTTP DELETE] ${this.axiosInstance.defaults.baseURL}${path}`);
            const response = await this.axiosInstance.delete(path);
            return response.data;
        }
        catch (error) {
            console.error(`[HTTP DELETE ERROR] ${path}:`, error.message);
            throw new Error(`Failed to DELETE ${path}: ${error.message}`);
        }
    }
}
exports.FetchClient = FetchClient;
//# sourceMappingURL=fetchClient.js.map