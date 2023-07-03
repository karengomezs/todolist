"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import * as Form from "@radix-ui/react-form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { deleteTask, getTodos, saveTodos, updateTask } from "@/api/tasks";
import { User } from "@clerk/nextjs/dist/types/server";

const schema = z
  .object({
    task: z.string().min(3, { message: "Must be longer than 3 characters" }),
    status: z.string().optional(),
  })
  .required();

export declare type TaskForm = z.infer<typeof schema>;
type Task = TaskForm & { id: string };

export default function Home() {
  const { user } = useUser();
  const [tasksList, setTasksList] = useState<Task[]>([]);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<TaskForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "pending",
    },
  });

  console.log(errors);

  useEffect(() => {
    if (user?.id) {
      getTodos(user.id).then((data) => {
        const todosArr = data?.docs.map((todo) => {
          const data = todo.data();
          return { id: todo.id, ...data };
        }) as Task[];
        setTasksList(todosArr);
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmit: SubmitHandler<TaskForm> = async (data) => {
    try {
      if (user?.id) {
        const doc = await saveTodos(user.id, data);
        if (doc?.id) {
          const task = {
            id: doc?.id,

            ...data,
          };

          setTasksList([task, ...tasksList]);
        }
      }
    } catch (error) {}
  };

  return (
    <main className="flex flex-col gap-5 px-6 mt-6 w-full">
      <p className="font-extrabold text-3xl text-slate-800">
        What's up, {user?.firstName}!
      </p>

      <Form.Root
        className="flex gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Form.Field className="flex flex-col gap-2 w-full" name="task">
          <Form.Control asChild>
            <input
              {...register("task")}
              className="flex-1 p-2 rounded-md border border-slate-300 bg-slate-100"
            />
          </Form.Control>
          <Form.Message
            className="text-red-600 text-xs"
            match="valueMissing"
            forceMatch={!!errors.task?.message}
          >
            {errors.task?.message}
          </Form.Message>
        </Form.Field>

        <Form.Submit asChild>
          <button
            // disabled={isSubmitting}
            type="submit"
            className=" rounded-full bg-slate-500 text-white font-bold w-12 h-10"
          >
            +
          </button>
        </Form.Submit>
      </Form.Root>

      <div>
        {tasksList.map((todo) => {
          console.log(todo);

          return (
            <div className="flex justify-between" key={todo.task}>
              <p className={`${todo.status === "done" ? "line-through" : ""}`}>
                {todo.task}
              </p>
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  defaultChecked={todo.status === "done"}
                  onChange={(e) => {
                    if (e.target.checked && user?.id) {
                      updateTask(user.id, todo.id, "done");
                    } else if (user?.id) {
                      updateTask(user.id, todo.id, "pending");
                    }
                  }}
                />
                <button
                  onClick={async () => {
                    try {
                      if (user?.id) {
                        await deleteTask(user.id, todo.id);
                        const index = tasksList.findIndex(
                          (e) => e.id === todo.id
                        );
                        let newArray = [...tasksList];
                        newArray.splice(index, 1);
                        setTasksList([...newArray]);
                      }
                    } catch (error) {}
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
