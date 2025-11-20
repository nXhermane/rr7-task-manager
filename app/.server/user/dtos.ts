import z from "zod";
import type { UserOutput, UpdateUserInput } from "~/lib/schema";
export type UserDto = z.infer<typeof UserOutput>;
export type UpdateUserDto = z.infer<typeof UpdateUserInput>;
