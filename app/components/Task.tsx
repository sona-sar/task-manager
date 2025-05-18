import React from "react";
import { FaCheck, FaCircle, FaSquare, FaStar, FaPen } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export type TaskType = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: number;
  deadline: number;
};

type TaskProps = {
  task: TaskType;
  onToggle: (id: string) => void;
};

const Task: React.FC<TaskProps> = ({ task, onToggle }) => {
  return (
    <div className="p-4 rounded-2xl border min-h-40 flex flex-col justify-between bg-white dark:bg-slate-900 cursor-pointer transform hover:scale-102 duration-150">
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="w-5 h-5 p-0 leading-none flex items-center justify-center"
            >
              <FaPen className="p-0 m-0 w-1 h-1 text-black dark:text-white transform" />
            </Button>
            <Button
              variant="default"
              size="circle"
              className="w-5 h-5 min-w-5 rounded-full p-0 leading-none flex items-center justify-center bg-black dark:bg-white"
              onClick={() => onToggle(task.id)}
            >
              {task.completed ? (
                <FaCheck className="p-0 m-0 w-1 h-1 text-white dark:text-black transform scale-60" />
              ) : (
                <FaCircle className="p-0 m-0 w-1 h-1 text-white dark:text-black transform scale-90" />
              )}
            </Button>
          </div>
        </div>
        <p className="text-sm">{task.description}</p>
      </div>

      <div className="text-xs flex gap-2 items-center justify-between">
        <div
          className={`flex gap-1 items-center py-1 px-2 rounded-full
            ${
              task.priority === "low"
                ? "bg-lime-100 dark:bg-lime-300 text-lime-600 dark:text-green-950"
                : task.priority === "medium"
                ? "bg-orange-100 dark:bg-orange-400 text-orange-400 dark:text-orange-900"
                : "bg-red-100 dark:bg-rose-400 text-red-400 dark:text-red-950"
            }`}
        >
          {task.priority === "low" ? (
            <FaCircle />
          ) : task.priority === "medium" ? (
            <FaSquare />
          ) : (
            <FaStar />
          )}
          {task.priority}
        </div>

        <div>
          <p>{task.deadline} days left</p>
        </div>
      </div>
    </div>
  );
};

export default Task;
