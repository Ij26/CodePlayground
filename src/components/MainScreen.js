import React, { useEffect, useState } from "react";
import { GiCat, GiRat } from "react-icons/gi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./MainScreen.css";

const MainScreen = ({ catActions, ratActions, onAddAction }) => {
  const [catPosition, setCatPosition] = useState({ x: 0, y: 0 });
  const [ratPosition, setRatPosition] = useState({ x: 150, y: 0 });
  const [catRotation, setCatRotation] = useState(0);
  const [ratRotation, setRatRotation] = useState(0);
  const [isAnimatingCat, setIsAnimatingCat] = useState(false);
  const [isAnimatingRat, setIsAnimatingRat] = useState(false);
  const [showRat, setShowRat] = useState(false);

  const reset = () => {
    setCatPosition({ x: 0, y: 0 });
    setRatPosition({ x: 150, y: 0 });
    setCatRotation(0);
    setRatRotation(0);
    setIsAnimatingCat(false);
    setIsAnimatingRat(false);
  };

  const performActions = async (actions, setPosition, setRotation, isCat) => {
    const executeAction = async (action) => {
      return new Promise((resolve) => {
        switch (action) {
          case "Move X by 50":
            setPosition((prev) => ({ ...prev, x: prev.x + 50 }));
            break;
          case "Move Y by 50":
            setPosition((prev) => ({ ...prev, y: prev.y + 50 }));
            break;
          case "Move X by -50":
            setPosition((prev) => ({ ...prev, x: prev.x - 50 }));
            break;
          case "Move Y by -50":
            setPosition((prev) => ({ ...prev, y: prev.y - 50 }));
            break;
          case "Rotate 360":
            setRotation((prev) => prev + 360);
            break;
          case "Go to (0, 0)":
            setPosition({ x: 0, y: 0 });
            break;
          case "Move to random point":
            const randomX = Math.floor(Math.random() * 200) - 100;
            const randomY = Math.floor(Math.random() * 200) - 100;
            setPosition({ x: randomX, y: randomY });
            break;
          case "Move to (2, 3)":
            setPosition({ x: 2, y: 3 });
            break;
          default:
            break;
        }
        setTimeout(resolve, 1000); 
      });
    };

    for (let i = 0; i < actions.length; i++) {
      if (actions[i] === "Repeat") {
        const previousActions = actions.slice(0, i);
        for (let action of previousActions) {
          await executeAction(action);
          detectCollision(); 
        }
      } else {
        await executeAction(actions[i]);
        detectCollision(); 
      }
    }
  };

  const detectCollision = () => {
    const distanceX = Math.abs(catPosition.x - ratPosition.x);
    const distanceY = Math.abs(catPosition.y - ratPosition.y);

    if (distanceX <= 10 && distanceY <= 10) {
      // Collision detected: Swap actions and adjust positions
      swapActions();
      adjustPositions();
    }
  };

  const swapActions = () => {
    // Swap the actions between cat and rat
    const temp = [...catActions];
    catActions.length = 0;
    ratActions.length = 0;
    catActions.push(...ratActions);
    ratActions.push(...temp);

    console.log("Collision detected! Actions swapped!");
  };

  const adjustPositions = () => {
    // Adjust positions to prevent overlap
    setCatPosition((prev) => ({ ...prev, x: prev.x - 10 }));
    setRatPosition((prev) => ({ ...prev, x: prev.x + 10 }));
  };

  useEffect(() => {
    if (isAnimatingCat && catActions.length > 0) {
      performActions(catActions, setCatPosition, setCatRotation, true).then(
        () => setIsAnimatingCat(false)
      );
    }
  }, [isAnimatingCat, catActions]);

  useEffect(() => {
    if (isAnimatingRat && ratActions.length > 0) {
      performActions(ratActions, setRatPosition, setRatRotation, false).then(
        () => setIsAnimatingRat(false)
      );
    }
  }, [isAnimatingRat, ratActions]);

  const handlePlayBoth = () => {
    if (catActions.length > 0) setIsAnimatingCat(true);
    if (ratActions.length > 0 && showRat) setIsAnimatingRat(true);
  };

  const removeRat = () => {
    setShowRat(false);
    setRatPosition({ x: 150, y: 0 });
  };

  return (
    <div className="main-container">
      <header className="header flex justify-between items-center">
        <span className="codeground-title">CodeGround</span>
        <button className="signin-button">Sign in</button>
      </header>

      <div className="main-content">
        <div className="cat-area">
          {/* Cat Icon */}
          <GiCat
            className="cat-icon"
            style={{
              fontSize: "60px",
              color: "orange",
              transform: `translate(${catPosition.x}px, ${catPosition.y}px) rotate(${catRotation}deg)`,
              transition: "transform 1s ease",
            }}
          />
          {/* Rat Icon */}
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
            <FontAwesomeIcon icon={faPlay} />
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
              <div className="rat-actions-container">
                <button
                  className="add-action-button"
                  onClick={() => onAddAction("rat")}
                >
                  Add Actions
                </button>
                <button className="delete-button" onClick={removeRat}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
