import crypto from "crypto";

const pendingActions = new Map();

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export const setPendingAction = ({
    userId,
    action,
    payload,
    message,
    ttlMs = DEFAULT_TTL_MS,
}) => {
    const now = Date.now();

    const pendingAction = {
        id: crypto.randomUUID(),
        action,
        payload,
        message,
        createdAt: now,
        expiresAt: now + ttlMs,
    };

    pendingActions.set(userId, pendingAction);

    return pendingAction;
};

export const getPendingAction = (userId) => {
    const action = pendingActions.get(userId);

    if (!action) return null;

    if (Date.now() > action.expiresAt) {
        pendingActions.delete(userId);
        return null;
    }

    return action;
};

export const clearPendingAction = (userId) => {
    pendingActions.delete(userId);
};

export const hasPendingAction = (userId) => {
    return Boolean(getPendingAction(userId));
};

export const cleanupExpiredPendingActions = () => {
    const now = Date.now();

    for (const [userId, action] of pendingActions.entries()) {
        if (now > action.expiresAt) {
            pendingActions.delete(userId);
        }
    }
};
