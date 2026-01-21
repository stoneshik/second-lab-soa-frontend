import axios from "axios";

export const apiForSecond = axios.create({
    baseURL: "https://localhost:33521/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
    },
});
