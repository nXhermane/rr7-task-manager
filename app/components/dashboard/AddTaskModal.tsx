import { Form, useFetcher, useSubmit } from "react-router"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "../ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { Textarea } from "../ui/textarea"
import type { CreateTaskInput, Task } from "~/lib/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

interface AddTaskModalProps {
    isVisible: boolean
    onClose: () => void
}

export function AddTaskModal(props: AddTaskModalProps) {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const mutation = useMutation({
        mutationKey: ['addTask'],
        mutationFn: async (data: CreateTaskInput) => {
            
        },
    })
    const submit = useSubmit()
    const addTaskFetchers = useFetcher<{ task: Task }>()
    const onSubmit = async (data: CreateTaskInput & FormData) => {
        setIsSubmitting(true)
        await addTaskFetchers.submit(data, { method: 'post', action: '/api/task', })
        setIsSubmitting(false)
    }
    useEffect(() => {
        console.log('AddTaskModal useEffect')
        if (addTaskFetchers.data) {
            console.log(addTaskFetchers.data)
            toast.success('Tâche créée avec succès')
        }
    }, [addTaskFetchers.data])

    return <Dialog open={props.isVisible} onOpenChange={(open) => !open && props.onClose()}>

        <DialogOverlay className="backdrop-blur-xs  items-center justify-center z-50" />
        <DialogContent className="bg-slate-800 text-white rounded-2xl p-8 max-w-sm w-full mx-4 border border-slate-700 shadow-2xl" showCloseButton={false}>
            <DialogHeader className="flex flex-row items-center justify-between mb-6">
                <DialogTitle className="text-2xl font-bold">Nouvelle Tâche</DialogTitle>
                <div onClick={() => props.onClose()} className="text-slate-400 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </DialogHeader>

            <FieldGroup className="space-y-4">
                <Field>
                    <FieldLabel htmlFor="task-title">Titre</FieldLabel>
                    <Input id="task-title" className="w-full h-12 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Entrer le titre de la tâche" {...register("title", {
                        required: true,
                        minLength: { value: 3, message: "Le titre doit tre au moins 3 " }
                    })} />
                    {errors.title && <FieldError className="text-red-500">{errors.title.message?.toString()}</FieldError>}
                </Field>
                <Field>
                    <FieldLabel htmlFor="task-description">Description</FieldLabel>
                    <Textarea id="task-description" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Entrer la description de la tâche" {...register("description", {
                        required: false,
                        minLength: { value: 3, message: "La description doit tre au moins 3 " }
                    })} />
                    {errors.description && <FieldError className="text-red-500">{errors.description.message?.toString()}</FieldError>}
                </Field>
                <DialogFooter className="flex space-x-3 mt-6 flex-row">
                    <Field >
                        <Button type="submit" onClick={handleSubmit(onSubmit as any)} className="flex-1 h-12 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition">
                            {isSubmitting ? 'Création...' : 'Créer'}
                        </Button>
                    </Field>
                    <Button type="button" onClick={() => props.onClose()} className="px-6 py-3 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition">
                        Annuler
                    </Button>
                </DialogFooter>
            </FieldGroup>
        </DialogContent>
    </Dialog>

}
