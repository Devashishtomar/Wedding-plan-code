import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env.js';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import weddingRoutes from './routes/wedding.routes.js';
import guestRoutes from './routes/guest.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import invitationRoutes from './routes/invitation.routes.js';
import checklistRoutes from './routes/checklist.routes.js';
import rsvpRoutes from './routes/rsvp.routes.js';
import aiRoutes from "./routes/ai.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { errorMiddleware } from './middlewares/error.middleware.js';

export const app = express();

app.set('trust proxy', 1);

const corsOptions = {
    origin: (origin, callback) => {
        // allow server-to-server & same-origin
        if (!origin) return callback(null, true);

        if (origin === env.frontendUrl) {
            return callback(null, true);
        }

        return callback(new Error('CORS not allowed'));
    },
    credentials: true,
};

// Security headers
app.use(
    helmet({
        contentSecurityPolicy: false, // frontend handles CSP
        crossOriginEmbedderPolicy: false,
        frameguard: { action: 'deny' },
    })
);

// JSON only
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());


// CORS 
app.use(cors(corsOptions));

// Global rate limit
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    })
);

app.use(
    '/static/templates',
    (req, res, next) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    }
);


app.use(
    '/static/templates',
    express.static(path.join(process.cwd(), 'templates/processed'))
);


// Example health route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/public", publicRoutes);


app.use(errorMiddleware);