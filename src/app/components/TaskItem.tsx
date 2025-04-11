import React from "react";

type TaskItemProps = {
  task: string;
  done: boolean;
  onToggle: () => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, done, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={done}
          onChange={onToggle}
          className="mr-2"
        />
        <span className={done ? "line-through text-gray-500" : ""}>{task}</span>
      </div>
    </div>
  );
};

export default TaskItem;
