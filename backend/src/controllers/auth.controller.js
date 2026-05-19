import { registerUser, loginUser, addCollaborator as addCollaboratorService } from '../services/auth.service.js';

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



export const addCollaborator = async (req, res) => {
    const { name, email, password, role, side, permissions } = req.body;

    const weddingId = req.weddingId;
    const addedById = req.user.id;

    const currentMemberContext = req.memberContext;
    if (!['BRIDE', 'GROOM', 'PENDING'].includes(currentMemberContext.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to add collaborators to this wedding.'
        });
    }

    const { user, member } = await addCollaboratorService({
        name,
        email,
        password,
        role,
        side, 
        permissions,
        weddingId,
        addedById
    });

    res.status(201).json({
        success: true,
        message: 'Collaborator successfully added to the wedding.',
        member: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: member.role
        }
    });
};