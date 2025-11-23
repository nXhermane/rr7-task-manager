import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function comparePasswords(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
}

export function generateToken(payload: object) {
    return jwt.sign(payload, 'my-secret', { expiresIn: '1d' });
}
export function verifyToken(token: string) {
    return jwt.verify(token, 'my-secret');
}
