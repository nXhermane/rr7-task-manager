import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "../ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { Textarea } from "../ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateTaskInput as CreateTaskInputSchema } from "~/lib/schema"
import type { CreateTaskInput, Task } from "~/lib/types"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TASK, TASKS, USER_STATS } from "~/lib/query_key"
import { addTask } from "~/lib/api"

interface AddTaskModalProps {
    isVisible: boolean
    onClose: () => void
}

export function AddTaskModal(props: AddTaskModalProps) {
    const queryClient = useQueryClient()
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(CreateTaskInputSchema)
    })
    const mutation = useMutation({
        mutationKey: [TASK],
        mutationFn: ({ dto }: { dto: CreateTaskInput }) => addTask(dto),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: [USER_STATS] })
            queryClient.invalidateQueries({ queryKey: [TASKS] })
            toast.success('Task created successfully')
            props.onClose()
            reset()
        },
        onError: (e) => {
            console.error(e)
            toast.error('Failed to create a new task')
        }
    })

    const onSubmit = async (data: CreateTaskInput & FormData) => {
        mutation.mutate({ dto: data })

    }


    return <Dialog open={props.isVisible} onOpenChange={(open) => !open && props.onClose()}>

        <DialogOverlay className="backdrop-blur-xs  items-center justify-center z-50" />
        <DialogContent className="bg-slate-800 text-white rounded-2xl p-8 max-w-sm w-full mx-4 border border-slate-700 shadow-2xl" showCloseButton={false}>
            <DialogHeader className="flex flex-row items-center justify-between mb-6">
                <DialogTitle className="text-2xl font-bold">Nouvelle Tâche</DialogTitle>
                <div onClick={() => props.onClose()} className="text-slate-400 hover:text-white transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </DialogHeader>
            <form noValidate onSubmit={handleSubmit(onSubmit as any)}>
                <FieldGroup className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="task-title">Titre</FieldLabel>
                        <Input id="task-title" className="w-full h-12 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Entrer le titre de la tâche" {...register("title")} />
                        {errors.title && <FieldError className="text-red-500">{errors.title.message?.toString()}</FieldError>}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="task-description">Description</FieldLabel>
                        <Textarea id="task-description" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition" placeholder="Entrer la description de la tâche" {...register("description")} />
                        {errors.description && <FieldError className="text-red-500">{errors.description.message?.toString()}</FieldError>}
                    </Field>
                    <DialogFooter className="flex space-x-3 mt-6 flex-row">
                        <Field>
                            <Button type="submit" className="flex-1 h-12 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition">
                                {mutation.isPending ? 'Création...' : 'Créer'}
                            </Button>
                        </Field>
                        <Button type="button" className="flex-1 h-12 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition">
                            {'Annuler'}
                        </Button>
                    </DialogFooter>
                </FieldGroup>
            </form>
        </DialogContent>

    </Dialog>

}
