import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getConfig } from '../config.js';

export class MxApiClient {
    private getClient(): AxiosInstance {
        const config = getConfig();
        const client = axios.create({
            baseURL: config.apiUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    throw new Error(`API Error: ${error.response.status} - ${error.response.data.message || error.message}`);
                }
                throw new Error(`Network Error: ${error.message}`);
            }
        );

        return client;
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const client = this.getClient();
        const response: AxiosResponse<T> = await client.get(endpoint, { params });
        return response.data;
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        const client = this.getClient();
        const response: AxiosResponse<T> = await client.post(endpoint, data);
        return response.data;
    }
}

export const mxApiClient = new MxApiClient();
