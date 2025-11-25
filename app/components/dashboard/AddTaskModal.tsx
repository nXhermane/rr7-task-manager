import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskInput  } from "~/lib/schema";
import type { CreateTaskInput, Task } from "~/lib/types";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TASK, TASKS, USER_STATS } from "~/lib/query_key";
import { addTask } from "~/lib/api";
import { X } from "lucide-react";

interface AddTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AddTaskModal(props: AddTaskModalProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(createTaskInput),
  });
  const mutation = useMutation({
    mutationKey: [TASK],
    mutationFn: ({ dto }: { dto: CreateTaskInput }) => addTask(dto),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [USER_STATS] });
      queryClient.invalidateQueries({ queryKey: [TASKS] });
      toast.success("Task created successfully");
      props.onClose();
      form.reset();
    },
    onError: (e) => {
      console.error(e);
      toast.error("Failed to create a new task");
    },
  });

  const onSubmit = async (data: CreateTaskInput & FormData) => {
    mutation.mutate({ dto: data });
  };

  return (
    <Dialog
      open={props.isVisible}
      onOpenChange={(open) => !open && props.onClose()}
    >
      <DialogOverlay className="backdrop-blur-xs  items-center justify-center z-50" />
      <DialogContent
        className="bg-slate-800 text-white rounded-2xl p-8 max-w-sm w-full mx-4 border border-slate-700 shadow-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between mb-6">
          <DialogTitle className="text-2xl font-bold">
            Nouvelle Tâche
          </DialogTitle>
          <div
            onClick={() => props.onClose()}
            className="text-slate-400 hover:text-white transition duration-300 ease-in-out hover:scale-110"
          >
            <X className="w-6 h-6" />
          </div>
        </DialogHeader>
        <form method="post" onSubmit={form.handleSubmit(onSubmit as any)}>
          <FieldGroup className="space-y-4">
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="task-title">Titre</FieldLabel>
                  <Input
                    {...field}
                    id="task-title"
                    className="w-full h-12 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    placeholder="Entrer le titre de la tâche"
                  />
                  {fieldState.error?.message && (
                    <FieldError className="text-red-500">
                      {fieldState.error?.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="task-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="task-description"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    placeholder="Entrer la description de la tâche"
                  />
                  {fieldState.error?.message && (
                    <FieldError className="text-red-500">
                      {fieldState.error?.message}
                    </FieldError>
                  )}
                </Field>
              )}
            />

            <DialogFooter className="flex space-x-3 mt-6 flex-row">
              <Field>
                <Button
                  type="submit"
                  className="duration-300 ease-in-out hover:scale-101 flex-1 h-12 px-6 py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-semibold transition"
                >
                  {mutation.isPending ? "Création..." : "Créer"}
                </Button>
              </Field>
              <Button
                type="button"
                className="duration-300 ease-in-out hover:scale-101 flex-1 h-12 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
              >
                {"Annuler"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
