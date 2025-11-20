import { ConflictError, UnauthorizedError } from "../utils/error";
import { comparePasswords, hashPassword } from "../utils/helpers";
import { prisma } from "../utils/prisma";
import type { SignInDto, SignUpDto } from "./dtos";


export async function signUp(dto: SignUpDto): Promise<void> {
    const checkUserAlreadyExists = await prisma.user.findUnique({
        where: {
            email: dto.email,
        },
    });
    if (checkUserAlreadyExists != null) {
        throw new ConflictError("User already exists")
    }
    const hashedPassword = await hashPassword(dto.password);
    await prisma.user.create({
        data: {
            name: dto.name,
            email: dto.email,
            hashPassword: hashedPassword,
        },
    });
}

export async function signIn(dto: SignInDto): Promise<{ id: string }> {
    const user = await prisma.user.findUnique({
        where: {
            email: dto.email,
        },
    });
    if (user === null) {
        throw new UnauthorizedError("Email or password invalid.")
    }
    const isPasswordValid = await comparePasswords(dto.password, user.hashPassword);
    if (!isPasswordValid) {
        throw new UnauthorizedError("Email or password invalid.")
    }
    return {
        id: user.id,
    };

}


