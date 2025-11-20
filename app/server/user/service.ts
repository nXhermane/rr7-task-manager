import { NotFoundError } from "../utils/error";
import { prisma } from "../utils/prisma";
import type { UpdateUserDto, UserDto } from "./dtos";

export async function getUser(id: string): Promise<UserDto> {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundError(`User with id ${id} not found`);
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
  
}
export async function deleteUser(id: string): Promise<void> {
        await prisma.user.delete({ where: { id } });
}

export async function updateUser(id: string, dto: UpdateUserDto): Promise<UserDto> {
    const user = await prisma.user.update({
        where: { id },
        data: dto,
    });
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

