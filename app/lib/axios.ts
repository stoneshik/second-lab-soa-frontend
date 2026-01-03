import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.URL_HOST_API_FOR_FRONTEND || "http://localhost:8080/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
    },
});
