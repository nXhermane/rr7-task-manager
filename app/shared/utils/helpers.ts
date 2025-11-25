import "dotenv/config"
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET environment variable is not set');
}
export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function comparePasswords(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
}
export function generateToken(payload: object) {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1d' });
}
export function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET! );
}
