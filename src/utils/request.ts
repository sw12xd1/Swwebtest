import axios from 'axios';

export const CreateAxiosInstance = (config?: any) => {
    const instance = axios.create({
        timeout: 5000,
        ...config
    });
}