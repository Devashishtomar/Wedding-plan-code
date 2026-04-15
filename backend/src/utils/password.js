import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // strong but still performant

export const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
