import { useEffect, useRef } from "react";
import "./App.css";
import Scene, { SceneRef } from "./components/Scene";
import Legend from "./components/Legend";

function App() {
  const sceneRef = useRef<SceneRef | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (sceneRef.current) {
      if (event.key === "ArrowLeft") {
        sceneRef.current.moveCoinLeft();
      } else if (event.key === "ArrowRight") {
        sceneRef.current.moveCoinRight();
      } else if (event.key === " ") {
        sceneRef.current.dropNextCoin();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div id="root">
      <Scene ref={sceneRef} />
      <Legend />
    </div>
  );
}

export default App;
