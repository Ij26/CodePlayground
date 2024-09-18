import React from "react";
import { useDrag } from "react-dnd";

const CommandItem = ({ command }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMMAND",
    item: { command },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`command-item bg-blue-500 text-white px-4 py-2 mb-2 w-full rounded-md cursor-pointer ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {command}
    </div>
  );
};

export default CommandItem;
