import axios from "axios";
import { api } from "@/lib/api";

export const sendAIMessage = async (message: string, eventId: string | null, view: string, currency: string) => {
    const res = await api.post("/api/ai/message", {
        message,
        eventId,
        view,
        currency
    });
    return res.data.response;
};