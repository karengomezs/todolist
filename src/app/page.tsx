"use client";
import { useEffect, useState, useContext } from "react";
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
import ThemeContext from "./context/theme-context";

const schema = z.object({
  id: z.string().optional(),
  task: z.string().min(3, { message: "Must be longer than 3 characters" }),
  status: z.string().optional(),
});

export declare type TaskForm = z.infer<typeof schema>;
type Task = TaskForm & { id: string };

export default function Home() {
  const themeState = useContext(ThemeContext);
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
        const todosArr = data?.docs.map((todo: any) => {
          const data = todo.data();
          return { id: todo.id, ...data };
        }) as Task[];
        setTasksList(todosArr || []);
      });
    }
  }, [user?.id]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

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

  const doneTasks = tasksList?.filter((task) => {
    return task.status === "done";
  });

  const pendingTasks = tasksList?.filter((task) => {
    return task.status === "pending";
  });

  return (
    <main
      className={`${
        themeState.theme === true ? "bg-slate-950" : "bg-slate-100"
      }  min-h-screen flex flex-col gap-5 px-6 py-14 w-full md:px-56`}
    >
      <p
        className={`font-extrabold text-4xl ${
          themeState.theme === true ? "text-white" : "text-slate-950"
        } `}
      >
        {"What's up,"} {user?.firstName}!
      </p>
      <p className="text-orange-500">
        {"Today's"} {today}
      </p>

      <Form.Root
        className="flex gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Form.Field className="flex flex-col gap-2 w-full" name="task">
          <Form.Control asChild>
            <input
              {...register("task")}
              placeholder="What do you want to do?"
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
            className=" rounded-full bg-orange-500 text-white font-bold w-12 h-10"
          >
            +
          </button>
        </Form.Submit>
      </Form.Root>

      <div
        className={`flex gap-3 mt-5 [&>p]:rounded-md [&>p]:p-2 [&>p]:text-orange-500 [&>p]:font-bold ${
          themeState.theme ? "[&>p]:bg-slate-900" : "[&>p]:bg-slate-300"
        } ${
          themeState.theme
            ? "[&>p>span]:text-white"
            : "[&>p>span]:text-slate-950"
        } `}
      >
        <p>
          Todos:
          <span> {tasksList?.length}</span>
        </p>
        <p>
          Done:
          <span> {doneTasks?.length}</span>
        </p>
        <p>
          Pending:
          <span> {pendingTasks?.length}</span>
        </p>
      </div>

      <div
        className={`flex flex-wrap md:flex-col gap-3 mt-5 p-3 rounded-md ${
          themeState.theme ? "bg-slate-900" : "bg-slate-300"
        }  `}
      >
        {tasksList?.map((todo) => {
          return (
            <div
              className="flex flex-col justify-between md:flex-row flex-1 p-2 font-bold text-lg rounded-md bg-orange-500"
              key={todo.id}
            >
              <p
                className={`${
                  themeState.theme ? "text-white" : "text-slate-950"
                } ${todo.status === "done" ? "line-through" : ""} pb-5`}
              >
                {todo.task}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setValue("task", todo.task);
                    setValue("id", todo.id);
                    setValue("status", todo.status);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-slate-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
                <input
                  className="w-5 h-5 check-input"
                  type="checkbox"
                  defaultChecked={todo.status === "done"}
                  onChange={async (e) => {
                    const todoAtrapado = tasksList?.find((task) => {
                      return task.id === todo.id;
                    });

                    if (e.target.checked && user?.id) {
                      await updateStatusTask(user.id, todo.id, "done");

                      if (todoAtrapado?.status) {
                        todoAtrapado.status = "done";
                        const withoutRepeatTask = tasksList?.filter((task) => {
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-slate-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
