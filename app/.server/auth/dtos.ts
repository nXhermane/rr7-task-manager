import { z } from "zod";
import type { SignInInput, SignUpInput } from "~/lib/schema";


export type SignInDto = z.infer<typeof SignInInput>;
export type SignUpDto = z.infer<typeof SignUpInput>;

