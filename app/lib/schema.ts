import z, { ZodIPv4 } from "zod";

export const signUpInput = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .nonempty({
      error: "Name cannot be empty",
    }),
  email: z.email({
    error: "Email is required",
  }),
  password: z
    .string({
      error: "Password is required",
    })
    .min(8)
    .regex(/^\d+$/, {
      error: "Le mot de passe doit contenir uniquement des chiffres",
    }),
});
export type SignUpInput = z.infer<typeof signUpInput>;
export const signInInput = z.object({
  email: z.email({
    error: "Email is required",
  }),
  password: z.string({
    error: "Password is required",
  }),
});

export type SignInInput = z.infer<typeof signInInput>;

export const createTaskInput = z.object({
  title: z.string().min(1).max(255),
  description: z.optional(z.string().min(0).max(255)).default(""),
});
export type CreateTaskInput = z.infer<typeof createTaskInput>;

export const updateTaskInput = z.object({
  title: z.optional(z.string().min(1).max(255)),
  description: z.optional(z.string().max(255)),
  status: z.optional(z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"])),
});
export type UpdateTaskInput = z.infer<typeof updateTaskInput>;
export const paginationInput = z
  .object({
    page: z.number().min(1).default(1),
    perPage: z.number().min(1).max(100).default(10),
  })
  .refine(
    (data) => {
      return data.page >= 1 && data.perPage >= 1 && data.perPage <= 100;
    },
    {
      message: "Invalid pagination parameters",
    }
  );
export type PaginationInput = z.infer<typeof paginationInput>;
export const userOutput = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type UserOutput = z.infer<typeof userOutput>;
export const updateUserInput = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInput>;
