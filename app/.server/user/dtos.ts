import z from "zod";

export const UserOutput = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export const UpdateUserInput = z.object({
    name: z.string().optional(),
    email: z.email().optional(),
})

export type UserDto = z.infer<typeof UserOutput>;
export type UpdateUserDto = z.infer<typeof UpdateUserInput>;
