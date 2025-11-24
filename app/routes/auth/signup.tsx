import { data, Link, redirect, useSubmit } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "~/components/ui/field";
import { useForm } from "react-hook-form"
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/signup";
import type { SignUpData } from "~/lib/types";
import { signUp } from "~/modules/auth/service";
import { handleError } from "~/shared/utils/error";
import { getSession } from "~/lib/session";
import { SignUpInput } from "~/lib/schema";


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

    return <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white bg-primary min-h-screen flex items-center justify-center">
        <Card className="bg-slate-800 text-white rounded-2xl p-8 max-w-lg w-full mx-4 border border-slate-700 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between mb-6">
                <CardTitle className="text-2xl font-bold">
                    Create an account
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit as any)} >
                    <FieldGroup className="space-y-2">
                        {typeof actionData?.errors === 'string' && <FieldError className="text-red-400">{actionData.errors}</FieldError>}
                        <Field>
                            <FieldLabel htmlFor="name" className="text-md">
                                Name
                            </FieldLabel>
                            <Input className="w-full h-12 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Enter your name" autoFocus autoComplete="name"  {...register("name", {
                                required: true,
                                minLength: { value: 3, message: "Name must be at least 3 characters long" }
                            })} />
                            {errors.name && <FieldError className="text-red-400">{errors.name.message?.toString()}</FieldError>}
                            {actionData?.errors?.name && <FieldError className="text-red-400">{actionData.errors.name}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email" className="text-md">
                                Email
                            </FieldLabel>
                            <Input className="w-full h-12 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Enter your email" type="email" {...register("email", {
                                required: true,
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address"
                                }
                            })} />
                            {errors.email && <FieldError className="text-red-400">{errors.email.message?.toString()}</FieldError>}
                            {actionData?.errors?.email && <FieldError className="text-red-400">{actionData.errors.email}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password" className="text-md">
                                Password
                            </FieldLabel>
                            <Input className="w-full h-12 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Enter your password" type="password" {...register("password", {
                                required: true,
                                minLength: { value: 8, message: "Password must be at least 8 characters long" }
                            })} />
                            {errors.password && <FieldError className="text-red-400">{errors.password.message?.toString()}</FieldError>}
                            {actionData?.errors?.password && <FieldError className="text-red-400">{actionData.errors.password}</FieldError>}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirmPassword" className="text-md">
                                Confirm Password
                            </FieldLabel>
                            <Input className="w-full h-12 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Re-enter your password" type="password" {...register("confirmPassword", {
                                required: true,
                                validate: { passwordMatch: (value) => value === watch("password") || "Passwords do not match" }
                            })} />
                            {errors.confirmPassword && <FieldError className="text-red-400">{errors.confirmPassword.message?.toString()}</FieldError>}
                        </Field>
                        <Field>
                            <Button className="flex-1 h-12 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition" type="submit">Sign Up</Button>
                        </Field>
                    </FieldGroup>
                </form>

                <div className="flex items-center flex-row gap-2 mt-2.5">
                    <CardDescription className="text-md text-white">
                        Already have an account?
                    </CardDescription>
                    <Link to="/auth/signin" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Log in</Link>
                </div>
            </CardContent>
        </Card>
    </div>
}