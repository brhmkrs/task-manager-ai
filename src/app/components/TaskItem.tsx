interface TaskItemProps {
  task: string;
  done: boolean;
  onToggle: () => void;
}

export default function TaskItem({ task, done, onToggle }: TaskItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <input type="checkbox" checked={done} onChange={onToggle} />
      <span className={done ? "line-through text-gray-400" : ""}>
        {task}
      </span>
    </div>
  );
}
