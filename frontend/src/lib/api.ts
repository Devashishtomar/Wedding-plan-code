import axios from "axios";
import { toast } from "@/hooks/use-toast";


let isHandling401 = false;


export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (!isHandling401) {
                isHandling401 = true;

                toast({
                    variant: "destructive",
                    title: "Session expired",
                    description: "Please log in again to continue.",
                });

                // small delay so the user sees the message
                setTimeout(() => {
                    window.location.href = "/login";
                }, 800);
            }
        }

        return Promise.reject(error);
    }
);
