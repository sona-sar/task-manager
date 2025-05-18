"use client";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

function header() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-between">
      <h2 className="text-xl">Task Manager 🚀</h2>
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <FaSun className="absolute h-10 w-10 rotate-0 scale-100 dark:-rotate-90 dark:scale-0"></FaSun>
        <FaMoon className="absolute h-10 w-10 rotate-90 scale-0 dark:-rotate-0 dark:scale-100"></FaMoon>
      </Button>
    </div>
  );
}

export default header;
