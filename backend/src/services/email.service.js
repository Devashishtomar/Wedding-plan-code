import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
    host: env.emailHost,
    port: Number(env.emailPort),
    secure: false,
    auth: {
        user: env.emailUser,
        pass: env.emailPass,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: env.emailFrom,
            to,
            subject,
            html,
        });

        logger.info(`📧 Email sent to ${to}`);
    } catch (error) {
        logger.error(error, 'Email sending failed');
        throw new Error('Email service error');
    }
};
