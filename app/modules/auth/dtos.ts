import { z } from "zod";
import type { signInInput, signUpInput } from "~/lib/schema";

export type SignInDto = z.infer<typeof signInInput>;
export type SignUpDto = z.infer<typeof signUpInput>;

