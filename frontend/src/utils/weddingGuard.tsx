import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "@/lib/api";

export const WeddingGuard = ({
    children,
}: {
    children: JSX.Element;
}) => {
    const [loading, setLoading] = useState(true);
    const [setupCompleted, setSetupCompleted] = useState<boolean | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkWeddingSetup = async () => {
            try {
                const res = await api.get("/api/weddings/me");
                setIsAuthenticated(true);
                setSetupCompleted(res.data.wedding?.setupCompleted === true);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    setIsAuthenticated(false);
                } else {
                    setIsAuthenticated(true);
                    setSetupCompleted(false);
                }
            } finally {
                setLoading(false);
            }
        };

        checkWeddingSetup();
    }, []);

    if (loading) return null;

    if (isAuthenticated === false) {
        return <Navigate to="/login" replace />;
    }

    if (setupCompleted === false) {
        return <Navigate to="/wedding-setup" replace />;
    }

    return children;
};
