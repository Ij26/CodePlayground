import React, { useState } from "react";
import "./App.css"; // Global styles
import MainScreen from "./components/MainScreen";
import CommandScreen from "./components/CommandScreen";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const [currentScreen, setCurrentScreen] = useState("main");
  const [activeSprite, setActiveSprite] = useState(null);
  const [catActions, setCatActions] = useState([]);
  const [ratActions, setRatActions] = useState([]);

  const handleDone = (sprite, actions) => {
    if (sprite === "cat") {
      setCatActions(actions);
    } else if (sprite === "rat") {
      setRatActions(actions);
    }
    setCurrentScreen("main");
  };

  const handleAddAction = (sprite) => {
    setActiveSprite(sprite);
    setCurrentScreen("commands");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {currentScreen === "main" ? (
          <MainScreen
            catActions={catActions}
            ratActions={ratActions}
            onAddAction={handleAddAction}
          />
        ) : (
          <CommandScreen
            onBack={() => setCurrentScreen("main")}
            onDone={handleDone}
            sprite={activeSprite}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;
