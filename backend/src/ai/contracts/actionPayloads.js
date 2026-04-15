import { AIActionType } from "./actions.enum.js";

export const ActionPayloadValidators = {
    [AIActionType.ADD_BUDGET_ITEM]: (p) =>
        typeof p?.category === "string" &&
        typeof p?.estimated === "number",

    [AIActionType.CREATE_TASK]: (p) =>
        typeof p?.title === "string" &&
        typeof p?.category === "string",

    [AIActionType.CREATE_GUEST]: (p) =>
        typeof p?.name === "string",

    [AIActionType.UPDATE_WEDDING_DETAILS]: (p) =>
        typeof p === "object" && p !== null,
};
