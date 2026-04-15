import { registerUser, loginUser } from '../services/auth.service.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    const { user, token } = await registerUser({ name, email, password });

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 30, // 30 minutes
    });

    res.status(201).json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
        },
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 30,
    });

    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
        },
    });
};


export const logout = async (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.json({
        success: true,
        message: 'Logged out successfully',
    });
};
