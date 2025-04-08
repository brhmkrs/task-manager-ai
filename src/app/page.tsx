"use client";
import React, { useState } from "react";
import TaskItem from "./components/TaskItem";

type Task = {
  task: string;
  done: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { task: "React öğren", done: false },
    { task: "TypeScript tekrar et", done: true },
  ]);
  const [newTask, setNewTask] = useState<string>("");

  const [newSuggest, setNewSuggest] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { task: newTask, done: false }]);
    setNewTask("");
  };

  const handleNewSuggest = async () => {
    if (newSuggest.trim() === "") return;

    try {
      const res = await fetch("http://localhost:8000/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: newSuggest }),
      });

      const data = await res.json();
      setSuggestions(data.suggestions); // backend'den gelen öneriler
    } catch (error) {
      console.error("AI öneri alınamadı:", error);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Görev Listesi</h1>

      {/* Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Yeni görev girin"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ekle
        </button>
      </div>

      {/* AI Öneri */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSuggest}
          onChange={(e) => setNewSuggest(e.target.value)}
          placeholder="AI'dan öneri al"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleNewSuggest}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          AI Sor
        </button>
      </div>

      {/* AI Öneri Liste */}
      {suggestions.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">AI Önerileri:</h2>
          <ul className="list-disc pl-5">
            {suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Görevler */}
      {tasks.map((item, index) => (
        <TaskItem
          key={index}
          task={item.task}
          done={item.done}
          onToggle={() => {
            const updatedTasks = [...tasks];
            updatedTasks[index].done = !updatedTasks[index].done;
            setTasks(updatedTasks);
          }}
        />
      ))}
    </main>
  );
}
