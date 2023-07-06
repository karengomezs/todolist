"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import * as Form from "@radix-ui/react-form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  deleteTask,
  getTodos,
  saveTodos,
  updateStatusTask,
  updateTask,
} from "@/api/tasks";

const schema = z.object({
  id: z.string().optional(),
  task: z.string().min(3, { message: "Must be longer than 3 characters" }),
  status: z.string().optional(),
});

export declare type TaskForm = z.infer<typeof schema>;
type Task = TaskForm & { id: string };

export default function Home() {
  const { user } = useUser();
  const [tasksList, setTasksList] = useState<Task[]>([]);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm<TaskForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "pending",
    },
  });

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
      const isEdit = Boolean(data.id);

      if (isEdit && user?.id && data.id) {
        await updateTask(user?.id, data.id, data.task);
        const newArr = [...tasksList];
        const index = newArr.findIndex((e) => e.id === data.id);
        newArr[index].task = data.task;
        setTasksList(newArr);
      }

      if (user?.id && !isEdit) {
        const doc = await saveTodos(user.id, data);
        if (doc?.id) {
          const task = {
            ...data,
            id: doc?.id,
          };
          setTasksList([task, ...tasksList]);
        }
      }
    } catch (error) {}
  };

  const date = new Date();
  const today = date.toDateString();

  return (
    <main className="flex flex-col gap-5 px-6 mt-6 w-full md:px-56">
      <p className="font-extrabold text-3xl text-slate-800">
        What's up, {user?.firstName}!
      </p>
      <p>Today's {today}</p>

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
          return (
            <div className="flex justify-between" key={todo.id}>
              <p className={`${todo.status === "done" ? "line-through" : ""}`}>
                {todo.task}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setValue("task", todo.task);
                    setValue("id", todo.id);
                    setValue("status", todo.status);
                  }}
                >
                  ✏️
                </button>
                <input
                  type="checkbox"
                  defaultChecked={todo.status === "done"}
                  onChange={async (e) => {
                    const todoAtrapado = tasksList.find((task) => {
                      return task.id === todo.id;
                    });

                    if (e.target.checked && user?.id) {
                      await updateStatusTask(user.id, todo.id, "done");

                      if (todoAtrapado?.status) {
                        todoAtrapado.status = "done";
                        const withoutRepeatTask = tasksList.filter((task) => {
                          return task.id !== todoAtrapado.id;
                        });
                        const newListTasks = [
                          ...withoutRepeatTask,
                          todoAtrapado,
                        ];
                        setTasksList(newListTasks);
                      }
                    } else if (user?.id) {
                      await updateTask(user.id, todo.id, "pending");
                      if (todoAtrapado?.status) {
                        todoAtrapado.status = "pending";
                        const withoutRepeatTask = tasksList.filter((task) => {
                          return task.id !== todoAtrapado.id;
                        });
                        const newListTasks = [
                          todoAtrapado,
                          ...withoutRepeatTask,
                        ];
                        setTasksList(newListTasks);
                      }
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
