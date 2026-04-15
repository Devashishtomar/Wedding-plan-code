import axios from "axios";
import { api } from "@/lib/api";


export const sendAIMessage = async (message: string) => {
    const res = await api.post("/api/ai/message", { message });
    return res.data.response;
};
