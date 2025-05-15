import { SceneRef } from "./Scene";
import "./Controls.css"

interface ControlsProps {
    sceneRef: React.RefObject<SceneRef|null>;
}

const Controls = (props: ControlsProps) => {
    const dropNextCoin = () => {
        props.sceneRef.current?.dropNextCoin();
    }

    const moveCoinLeft = () => {
        props.sceneRef.current?.moveCoinLeft();
    }

    const moveCoinRight = () => {
        props.sceneRef.current?.moveCoinRight();
    }

    return (
        <div className="controlsRoot">
            <button onClick={moveCoinLeft}>Left</button>
            <button onClick={dropNextCoin}>Drop</button>
            <button onClick={moveCoinRight}>Right</button>
        </div>
    )
}

export default Controls;