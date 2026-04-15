/**
 * Confirmation detection result types
 */
export const ConfirmationResult = Object.freeze({
    CONFIRM: "CONFIRM",
    DECLINE: "DECLINE",
    IGNORE: "IGNORE",
    TOPIC_SHIFT: "TOPIC_SHIFT",
});

/**
 * Normalize text for comparison
 */
const normalize = (text) =>
    text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();

/**
 * Explicit confirmation phrases
 * These MUST be unambiguous
 */
const CONFIRM_PHRASES = [
    "yes add it",
    "yes do it",
    "yes please",
    "go ahead",
    "please add it",
    "add this",
    "add it",
    "do it",
    "confirm",
    "proceed",
    "yes",
    "proceed",
    "update it",
];

/**
 * Explicit decline phrases
 */
const DECLINE_PHRASES = [
    "no",
    "no thanks",
    "dont add",
    "do not add",
    "not now",
    "skip",
    "maybe later",
    "ill do it myself",
    "cancel",
];

/**
 * Casual acknowledgements (NOT confirmations)
 */
const AMBIGUOUS_ACKS = [
    "yeah",
    "yep",
    "ok",
    "okay",
    "hmm",
    "maybe",
    "sure",
    "alright",
];

/**
 * Detect whether user message confirms, declines,
 * ignores, or shifts topic away from a pending action.
 */
export const detectConfirmation = ({
    userMessage,
    hasPendingAction,
}) => {
    if (!hasPendingAction) {
        return ConfirmationResult.IGNORE;
    }

    if (!userMessage || typeof userMessage !== "string") {
        return ConfirmationResult.IGNORE;
    }

    const text = normalize(userMessage);

    // -----------------------------
    // Explicit DECLINE
    // -----------------------------
    if (DECLINE_PHRASES.some((p) => text === p || text.startsWith(p))) {
        return ConfirmationResult.DECLINE;
    }

    // -----------------------------
    // Explicit CONFIRM
    // -----------------------------
    if (CONFIRM_PHRASES.some((p) => text === p || text.includes(p))) {
        return ConfirmationResult.CONFIRM;
    }

    // -----------------------------
    // Ambiguous acknowledgements
    // (never confirmation)
    // -----------------------------
    if (AMBIGUOUS_ACKS.includes(text)) {
        return ConfirmationResult.IGNORE;
    }

    // -----------------------------
    // Topic shift detection
    // Heuristic:
    // - If user asks a question
    // - Or message length is long and unrelated
    // -----------------------------
    const isQuestion =
        text.includes("what") ||
        text.includes("why") ||
        text.includes("how") ||
        text.includes("?");

    if (isQuestion || text.split(" ").length > 4) {
        return ConfirmationResult.TOPIC_SHIFT;
    }

    return ConfirmationResult.IGNORE;
};
