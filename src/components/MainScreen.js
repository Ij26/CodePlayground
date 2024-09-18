import React, { useEffect, useState } from "react";
import { GiCat, GiRat } from "react-icons/gi";
import "./MainScreen.css";

const MainScreen = ({ catActions, ratActions, onAddAction }) => {
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [ratPosition, setRatPosition] = useState({ x: 150, y: 0 });
  const [catRotation, setCatRotation] = useState(0);
  const [ratRotation, setRatRotation] = useState(0);
  const [isAnimatingCat, setIsAnimatingCat] = useState(false);
  const [isAnimatingRat, setIsAnimatingRat] = useState(false);
  const [showRat, setShowRat] = useState(false);
  const [isCollisionDetected, setIsCollisionDetected] = useState(false);

  const reset = () => {
    setCatPosition({ x: 0, y: 0 });
    setRatPosition({ x: 150, y: 0 });
    setCatRotation(0);
    setRatRotation(0);
    setIsAnimatingCat(false);
    setIsAnimatingRat(false);
    setIsCollisionDetected(false);
  };

  const detectCollision = () => {
    const distanceX = Math.abs(catPosition.x - ratPosition.x);
    const distanceY = Math.abs(catPosition.y - ratPosition.y);
    return distanceX < 60 && distanceY < 60;
  };

  const performActions = async (actions, setPosition, setRotation) => {
    let index = 0;

    const executeAction = (action) => {
      return new Promise((resolve) => {
        switch (action) {
          case "Move X by 50":
            setPosition((prev) => ({ ...prev, x: prev.x + 50 }));
            break;
          case "Move Y by 50":
            setPosition((prev) => ({ ...prev, y: prev.y - 50 }));
            break;
          case "Move X by -50":
            setPosition((prev) => ({ ...prev, x: prev.x - 50 }));
            break;
          case "Move Y by -50":
            setPosition((prev) => ({ ...prev, y: prev.y + 50 }));
            break;
          case "Rotate 360":
            setRotation((prev) => prev + 360);
            break;
          case "Go to (0, 0)":
            setPosition({ x: 0, y: 0 });
            break;
          default:
            break;
        }
        setTimeout(resolve, 1000);
      });
    };

    const runCommands = async (commandList) => {
      for (index = 0; index < commandList.length; index++) {
        await executeAction(commandList[index]);
        if (detectCollision()) {
          setIsCollisionDetected(true);
          return;
        }
      }
    };

    if (actions.length > 0) {
      const filteredActions = actions.filter((action) => action !== "Repeat");
      await runCommands(filteredActions);

      if (actions.includes("Repeat")) {
        await runCommands(filteredActions);
      }
    }
  };

  useEffect(() => {
    if (isAnimatingCat) {
      performActions(catActions, setCatPosition, setCatRotation);
    }
  }, [isAnimatingCat, catActions]);

  useEffect(() => {
    if (isAnimatingRat) {
      performActions(ratActions, setRatPosition, setRatRotation);
    }
  }, [isAnimatingRat, ratActions]);

  const handlePlayBoth = () => {
    setIsAnimatingCat(true);
    setIsAnimatingRat(true);
  };

  return (
    <div className="main-container">
      <header className="header flex justify-between items-center">
        <span className="codeground-title">CodeGround</span>
        <button className="signin-button">Sign in</button>
      </header>

      <div className="main-content">
        <div className="cat-area">
          <GiCat
            className="cat-icon"
            style={{
              fontSize: "60px",
              color: "orange",
              transform: `translate(${catPosition.x}px, ${catPosition.y}px) rotate(${catRotation}deg)`,
              transition: "transform 1s ease",
            }}
          />
          {showRat && (
            <GiRat
              className="rat-icon"
              style={{
                fontSize: "60px",
                color: "gray",
                transform: `translate(${ratPosition.x}px, ${ratPosition.y}px) rotate(${ratRotation}deg)`,
                transition: "transform 1s ease",
              }}
            />
          )}
        </div>

        <div className="control-section">
          <button className="play-button" onClick={handlePlayBoth}>
            <i className="fa fa-play"></i>
          </button>

          <button className="reset-button" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="action-container">
          <div className="cat-box">
            <GiCat className="small-cat-icon" />
            <button
              className="add-action-button"
              onClick={() => onAddAction("cat")}
            >
              Add Actions
            </button>
          </div>
          {!showRat ? (
            <div className="plus-box" onClick={() => setShowRat(true)}>
              <span>+</span>
            </div>
          ) : (
            <div className="rat-box">
              <GiRat className="small-rat-icon" />
              <button
                className="add-action-button"
                onClick={() => onAddAction("rat")}
              >
                Add Actions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
