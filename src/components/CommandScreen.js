import React, { useState } from "react";
import { useDrop } from "react-dnd";
import CommandItem from "./CommandItem";
import "./CommandScreen.css";

const CommandScreen = ({ onBack, onDone, sprite }) => {
  const [actions, setActions] = useState([]);

  // Drop zone for dropping commands
  const [, drop] = useDrop({
    accept: "COMMAND",
    drop: (item) => {
      setActions((prevActions) => [...prevActions, item.command]);
    },
  });

  // Handle removing an action
  const handleRemoveAction = (index) => {
    setActions((prevActions) => prevActions.filter((_, i) => i !== index));
  };

  // Dynamic heading based on sprite
  const heading = sprite === "cat" ? "Cat Commands" : "Rat Commands";

  return (
    <div className="commands-screen h-screen p-4">
      <header className="header bg-blue-500 p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="back-button bg-white text-blue-500 px-4 py-2 rounded"
        >
          &#x2190; Back
        </button>
        <h1 className="text-white text-2xl font-bold">{heading}</h1>
        <button
          className="done-button bg-white text-blue-500 px-4 py-2 rounded"
          onClick={() => onDone(sprite, actions)}
        >
          Done
        </button>
      </header>

      <div className="flex flex-row p-4 h-full w-full">
        {/* Left: List of code commands */}
        <div className="code-commands flex-grow bg-white p-4 rounded-md shadow-md overflow-y-scroll">
          <h2 className="text-xl font-bold mb-4">CODE</h2>
          <CommandItem command="Move X by 50" />
          <CommandItem command="Move Y by 50" />
          <CommandItem command="Move X by -50" />
          <CommandItem command="Move Y by -50" />
          <CommandItem command="Rotate 360" />
          <CommandItem command="Move to (2, 3)" /> {/* New Command */}
          <CommandItem command="Move to random point" /> {/* New Command */}
          <CommandItem command="Go to (0, 0)" />
          <CommandItem command="Repeat" />
        </div>

        {/* Right: Drop area for selected actions */}
        <div
          ref={drop}
          className="actions-area flex-grow bg-white p-4 rounded-md shadow-md ml-4"
        >
          <h2 className="text-xl font-bold mb-4">ACTION</h2>
          {actions.length === 0 ? (
            <div className="text-gray-400">Drop commands here</div>
          ) : (
            actions.map((action, index) => (
              <div
                key={index}
                className="action-item bg-green-200 p-4 rounded-md mb-2 shadow-md flex justify-between items-center"
              >
                <span>{action}</span>
                <button
                  className="delete-button bg-red-500 text-white p-2 rounded-full ml-4"
                  onClick={() => handleRemoveAction(index)}
                >
                  &#128465;
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandScreen;
