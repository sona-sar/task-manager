"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import Task, { TaskType } from "./Task";

function Main() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"dateadded" | "daysleft" | "priority">(
    "dateadded"
  );

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
        break;
      case "daysleft":
        tasks.sort((a, b) => a.deadline - b.deadline);
        break;
      default:
        tasks.sort((a, b) => a.createdAt - b.createdAt);
        break;
    }
  };

  const [tasks, setTasks] = useState<TaskType[]>([
    {
      id: "1",
      title: "Finish project",
      description: "Complete the UI for the dashboard",
      completed: false,
      priority: "high",
      createdAt: 1,
      deadline: 4,
    },
    {
      id: "2",
      title: "Finish project",
      description: "Complete the UI for the dashboard",
      completed: true,
      priority: "low",
      createdAt: 2,
      deadline: 5,
    },
    {
      id: "3",
      title: "Finish project",
      description: "Complete the UI for the dashboard",
      completed: false,
      priority: "medium",
      createdAt: 3,
      deadline: 1,
    },
    {
      id: "4",
      title: "Hello project",
      description: "Complete the UI for the dashboard",
      completed: false,
      priority: "high",
      createdAt: 4,
      deadline: 10,
    },
  ]);

  const handleToggle = (id: string) => {
    console.log(id);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
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
          <Button className="rounded-full">+ Add Task</Button>
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
            <Task key={task.id} task={task} onToggle={handleToggle} />
          ))}
      </div>
    </div>
  );
}

export default Main;
