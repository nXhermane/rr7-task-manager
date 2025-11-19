import z from "zod";
import { TastkStatus } from "~/.server/generated/prisma/enums";

export const SignUpInput = z.object({
    name: z.string({
        error: "Name is required"
    }).nonempty({
        error: "Name cannot be empty"
    }),
    email: z.email({
        error: "Email is required"
    }),
    password: z.string(
        {
            error: "Password is required"
        }
    ).min(8).regex(/^\d+$/, {
        error: "Le mot de passe doit contenir uniquement des chiffres"
    }),
});

export const SignInInput = z.object({
    email: z.email({
        error: "Email is required"
    }),
    password: z.string({
        error: "Password is required"
    })
});


export const CreateTaskInput = z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1).max(255).nullable(),
})

export const UpdateTaskInput = z.object({
    title: z.string().min(1).max(255).nullable(),
    description: z.string().min(1).max(255).nullable(),
    status: z.enum(Object.values(TastkStatus)).nullable(),
});