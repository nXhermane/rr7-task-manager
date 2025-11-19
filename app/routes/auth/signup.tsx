import { data, Link, redirect, useSubmit } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { useForm } from "react-hook-form"
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/signup";
import type { SignUpData } from "~/lib/types";
import { SignUpInput } from "~/.server/auth/dtos";
import { signUp } from "~/.server/auth/service";
import { handleError } from "~/.server/utils/error";
import { getSession } from "~/lib/session";


export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const validationResult = SignUpInput.safeParse(Object.fromEntries(formData));
    if (!validationResult.success) {
        return {
            status: 400,
            errors: Object.fromEntries(validationResult.error.issues.map(issue => [issue.path, issue.message]))
        }
    }
    try {
        await signUp(validationResult.data)
        return redirect('/auth/signin')
    } catch (error) {
        const handledError = handleError(error);
        return data({
            status: handledError.code,
            errors: handledError.message
        })
    }

}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get('Cookie'));
    if (session.has("token")) {
        return redirect("/");
    }
    return null;
}   

export default function SignUpComponent({ actionData }: Route.ComponentProps) {
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors }
    } = useForm()

    const submit = useSubmit();

    const onSubmit = (data: SignUpData & FormData) => {
        return submit({
            name: data.name,
            email: data.email,
            password: data.password
        }, {
            method: "post"
        })
    }

    return <div className="bg-primary min-h-screen flex items-center justify-center text-white">
        <Card className="w-full max-w-sm">
            <CardHeader className="">
                <CardTitle className=" leading-7">
                    Create an account
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit as any)} >
                    <FieldGroup>
                        {typeof actionData?.errors === 'string' && <FieldError>{actionData.errors}</FieldError>}
                        <Field>
                            <FieldLabel htmlFor="name" className="font-medium text-sm text-gray-700 ">
                                Name
                            </FieldLabel>
                            <Input placeholder="Enter your name" autoFocus autoComplete="name"  {...register("name", {
                                required: true,
                                minLength: { value: 3, message: "Name must be at least 3 characters long" }
                            })} />
                            {errors.name && <FieldError>{errors.name.message?.toString()}</FieldError>}
                            {actionData?.errors?.name && <FieldError>{actionData.errors.name}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email" className="font-medium text-sm text-gray-700 ">
                                Email
                            </FieldLabel>
                            <Input placeholder="Enter your email" type="email" {...register("email", {
                                required: true,
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })} />
                            {errors.email && <FieldError>{errors.email.message?.toString()}</FieldError>}
                            {actionData?.errors?.email && <FieldError>{actionData.errors.email}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password" className="font-medium text-sm text-gray-700 ">
                                Password
                            </FieldLabel>
                            <Input placeholder="Enter your password" type="password" {...register("password", {
                                required: true,
                                minLength: { value: 8, message: "Password must be at least 8 characters long" }
                            })} />
                            {errors.password && <FieldError>{errors.password.message?.toString()}</FieldError>}
                            {actionData?.errors?.password && <FieldError>{actionData.errors.password}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirmPassword" className="font-medium text-sm text-gray-700 ">
                                Confirm Password
                            </FieldLabel>
                            <Input placeholder="Re-enter your password" type="password" {...register("confirmPassword", {
                                required: true,
                                validate: { passwordMatch: (value) => value === watch("password") || "Passwords do not match" }
                            })} />
                            {errors.confirmPassword && <FieldError>{errors.confirmPassword.message?.toString()}</FieldError>}
                        </Field>
                        <Field>
                            <Button type="submit">Sign Up</Button>
                        </Field>
                    </FieldGroup>
                </form>

                <div className="flex items-center flex-row gap-2 mt-2.5">
                    <CardDescription className="">
                        Already have an account?
                    </CardDescription>
                    <Link to="/auth/signin" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Log in</Link>
                </div>
            </CardContent>
        </Card>
    </div>
}