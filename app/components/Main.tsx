"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import Task, { TaskType } from "./Task";
import { FaCircle, FaSquare, FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function Main() {
  const tasks = useQuery(api.tasks.get) ?? [];
  const addTask = useMutation(api.tasks.add);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const toggleCompleted = useMutation(api.tasks.toggleCompleted);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"dateadded" | "daysleft" | "priority">(
    "dateadded"
  );
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low" as "low" | "medium" | "high",
    deadline: 1,
  });
  const [date, setDate] = useState<Date | undefined>();

  const sortTasks = (tasks: TaskType[]) => {
    switch (sort) {
      case "priority":
        const priorityOrder: Record<TaskType["priority"], number> = {
          high: 0,
          medium: 1,
          low: 2,
        };
        tasks.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      case "daysleft":
        tasks.sort((a, b) => a.deadline - b.deadline);
        break;
      default:
        tasks.sort((a, b) => a.createdAt - b.createdAt);
        break;
    }
  };

  const addNewTask = async (
    task: Omit<TaskType, "id" | "createdAt" | "completed">
  ) => {
    await addTask(task);
    setNewTask({
      title: "",
      description: "",
      priority: "low",
      deadline: 1,
    });
    setDate(undefined);
  };

  const handleToggle = async (id: string) => {
    await toggleCompleted({ id: id as any });
  };

  const handleDelete = async (id: string) => {
    await deleteTask({ id: id as any });
  };

  const sortedTasks = [...tasks];
  sortTasks(sortedTasks);

  return (
    <div>
      {/* top */}
      <div className="flex justify-between items-center py-10">
        <div className="flex gap-4">
          <div className="flex items-center bg-black/3 dark:bg-white/8 rounded-full px-3 py-2">
            <FaMagnifyingGlass className="text-black dark:text-white" />
            <input
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-black dark:text-white outline-none ml-2"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">+ Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-2">Add a new task!</DialogTitle>
                <div>
                  <p className="text-sm">Title*</p>
                  <input
                    placeholder="Enter title"
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="placeholder:text-sm text-sm px-3 py-2 mt-1 outline-none rounded-full border"
                  />
                </div>
                <div>
                  <p className="text-sm">Description</p>
                  <input
                    placeholder="Enter description"
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="placeholder:text-sm text-sm px-3 py-2 mt-1 outline-none rounded-full border"
                  />
                </div>
                <div className="flex gap-2 items-center text-xs mt-2">
                  <button
                    onClick={() => setNewTask({ ...newTask, priority: "high" })}
                    className={`cursor-pointer flex items-center gap-1 px-3 py-2 rounded-full border transition-colors ${
                      newTask.priority === "high"
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground"
                    }`}
                  >
                    <FaStar className="text-xs" /> High
                  </button>

                  <button
                    onClick={() =>
                      setNewTask({ ...newTask, priority: "medium" })
                    }
                    className={`cursor-pointer flex items-center gap-1 px-3 py-2 rounded-full border transition-colors ${
                      newTask.priority === "medium"
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground"
                    }`}
                  >
                    <FaSquare className="text-xs" /> Medium
                  </button>

                  <button
                    onClick={() => setNewTask({ ...newTask, priority: "low" })}
                    className={`cursor-pointer flex items-center gap-1 px-3 py-2 rounded-full border transition-colors ${
                      newTask.priority === "low"
                        ? "bg-primary text-primary-foreground"
                        : "text-secondary-foreground"
                    }`}
                  >
                    <FaCircle className="text-xs" /> Low
                  </button>
                </div>

                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date*</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          if (selectedDate) {
                            setNewTask({
                              ...newTask,
                              deadline: selectedDate.getTime(),
                            });
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={async () => {
                      if (!newTask.title || !date) {
                        alert("Invalid input!");
                        return;
                      }

                      await addNewTask(newTask);
                      setDialogOpen(false);
                    }}
                    className="rounded-full"
                  >
                    Save
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-4">
          <p>Sort by:</p>
          <div className="relative">
            <select
              onChange={(e) =>
                setSort(e.target.value as "dateadded" | "daysleft" | "priority")
              }
              className="appearance-none  cursor-pointer rounded-full border bg-white dark:bg-slate-800 dark:text-white px-4 py-2 pr-8 text-sm focus:outline-none"
            >
              <option value="dateadded">Date Added</option>
              <option value="priority">Priority</option>
              <option value="daysleft">Days Left</option>
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 scale-80 dark:text-white" />
          </div>
        </div>
      </div>

      {/* tasks */}
      <div className="grid grid-cols-3 gap-4">
        {sortedTasks
          .filter((task) => {
            return search.toLowerCase() === ""
              ? task
              : task.title.toLowerCase().includes(search.toLowerCase());
          })
          .map((task) => (
            <Task
              key={task._id}
              task={{ ...task, id: task._id }}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
}

export default Main;
