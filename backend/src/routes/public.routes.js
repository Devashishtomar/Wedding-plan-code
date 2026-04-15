import express from "express";
import { renderPublicInvitationImage } from "../controllers/invitationPublic.controller.js";

const router = express.Router();

router.get("/invitations/:invitationId/render", renderPublicInvitationImage);

export default router;
