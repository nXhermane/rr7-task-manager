import z from "zod";

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
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).nullable(),
});

export const PaginationInput = z.object({
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(10),
}).refine((data) => {
    return data.page >= 1 && data.perPage >= 1 && data.perPage <= 100;
}, {
    message: "Invalid pagination parameters"
});

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
