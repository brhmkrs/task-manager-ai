"use client";
import { useEffect, useState } from "react";
import TaskItem from "./components/TaskItem";

type Task = {
  id: number;
  task: string;
  done: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [newSuggest, setNewSuggest] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/tasks");
        if (!res.ok) {
          const errorText = await res.text(); // Hata mesajını al
          throw new Error(
            `HTTP hatası! Durum: ${res.status}, Mesaj: ${errorText}`
          );
        }
        const data = await res.json();
        console.log("Gelen görev datası:", data);
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("API'den gelen veri bir dizi değil:", data);
          setTasks([]);
        }
      } catch (error) {
        console.error("Görevler alınamadı:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;

    try {
      const res = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newTask, done: false }),
      });

      if (!res.ok) {
        throw new Error(`HTTP hatası! Durum: ${res.status}`);
      }

      const addedTask = await res.json();
      setTasks([...tasks, addedTask]);
      setNewTask("");
    } catch (error) {
      console.error("Görev eklenemedi:", error);
    }
  };

  const handleNewSuggest = async () => {
    if (newSuggest.trim() === "") return;

    try {
      const res = await fetch("http://localhost:8000/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: newSuggest }),
      });

      if (!res.ok) {
        throw new Error(`HTTP hatası! Durum: ${res.status}`);
      }

      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("AI öneri alınamadı:", error);
    }
  };

  const handleAddSuggestedTask = async (suggestedTask: string) => {
    try {
      const res = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: suggestedTask, done: false }),
      });

      if (!res.ok) {
        throw new Error(`HTTP hatası! Durum: ${res.status}`);
      }

      const addedTask = await res.json();
      setTasks([...tasks, addedTask]);
    } catch (error) {
      console.error("Önerilen görev eklenemedi:", error);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Görev Listesi</h1>

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

      {suggestions.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">AI Önerileri:</h2>
          <ul className="list-disc pl-5 space-y-2">
            {suggestions.map((suggestion, idx) => (
              <li
                key={`${suggestion}-${idx}`}
                className="flex justify-between items-center"
              >
                <span>{suggestion}</span>
                <button
                  onClick={() => handleAddSuggestedTask(suggestion)}
                  className="ml-4 px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Ekle
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p>Yükleniyor...</p>
      ) : tasks.length > 0 ? (
        tasks.map((item) => (
          <TaskItem
            key={item.id}
            task={item.task}
            done={item.done}
            onToggle={() => {
              const updatedTasks = tasks.map((t) =>
                t.id === item.id ? { ...t, done: !t.done } : t
              );
              setTasks(updatedTasks);
            }}
          />
        ))
      ) : (
        <p>Görev bulunamadı.</p>
      )}
    </main>
  );
}
