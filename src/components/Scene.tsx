import { useEffect, useRef } from "react";

const COIN_SIZE = 50;
const CELL_SIZE = Math.floor(COIN_SIZE * 1.3);
const BOARD_WIDTH = CELL_SIZE * 7;
const BOARD_HEIGHT = CELL_SIZE * 6;
const SELECTION_HEIGHT = CELL_SIZE;

const CANVAS_WIDTH = BOARD_WIDTH;
const CANVAS_HEIGHT = BOARD_HEIGHT + SELECTION_HEIGHT;

function Scene() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (ctx == null) return;

    // Selection zone
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, BOARD_WIDTH, SELECTION_HEIGHT);

    // Board background
    ctx.fillStyle = "blue";
    ctx.fillRect(0, SELECTION_HEIGHT, BOARD_WIDTH, BOARD_HEIGHT);

    ctx.save();

    // Board holes
    ctx.beginPath();
    ctx.fillStyle = "white";
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        ctx.moveTo(
          CELL_SIZE * (col + 0.5),
          CELL_SIZE * (row + 0.5) + SELECTION_HEIGHT
        );
        ctx.arc(
          CELL_SIZE * (col + 0.5),
          CELL_SIZE * (row + 0.5) + SELECTION_HEIGHT,
          COIN_SIZE / 2,
          0,
          Math.PI * 2,
          true
        );
      }
    }
    ctx.fill();
    ctx.clip();

    // Coin
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(
      CELL_SIZE * (2 + 0.5),
      CELL_SIZE * (3 + 0.5) + COIN_SIZE * 0.2,
      COIN_SIZE / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }, [canvas]);

  return (
    <canvas ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
  );
}

export default Scene;
