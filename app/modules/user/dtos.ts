import z from "zod";
import type { userOutput, updateUserInput } from "~/lib/schema";
export type UserDto = z.infer<typeof userOutput>;
export type UpdateUserDto = z.infer<typeof updateUserInput>;
