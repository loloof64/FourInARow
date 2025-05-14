import { useEffect, useRef, useState } from "react";

export enum CoinType {
  RED,
  YELLOW,
  UNSET,
}

const COIN_SIZE = 50;
const CELL_SIZE = Math.floor(COIN_SIZE * 1.3);
const BOARD_WIDTH = CELL_SIZE * 7;
const BOARD_HEIGHT = CELL_SIZE * 6;
const SELECTION_HEIGHT = CELL_SIZE;

const CANVAS_WIDTH = BOARD_WIDTH;
const CANVAS_HEIGHT = BOARD_HEIGHT + SELECTION_HEIGHT;

function Scene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [coins, setCoins] = useState<CoinType[][]>([]);

  function getEmptyBoardData(): CoinType[][] {
    let newValue: CoinType[][] = [];
    for (let row = 0; row < 6; row++) {
      let lineValue: CoinType[] = [];
      for (let col = 0; col < 7; col++) {
        lineValue[col] = CoinType.UNSET;
      }
      newValue[row] = [...lineValue];
    }

    return newValue;
  }

  function drawBoard() {
    if (coins.length === 0) return;
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

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (coins[row][col] === CoinType.RED) {
          ctx.fillStyle = "red";
        } else if (coins[row][col] === CoinType.YELLOW) {
          ctx.fillStyle = "yellow";
        } else {
          continue;
        }
        ctx.beginPath();
        ctx.arc(
          CELL_SIZE * (col + 0.5),
          CELL_SIZE * (row + 0.5) + SELECTION_HEIGHT,
          COIN_SIZE / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    ctx.restore();
  }

  useEffect(() => {
    setCoins(getEmptyBoardData());
  }, []);

  useEffect(() => {
    drawBoard();
  }, [canvas, coins]);

  return (
    <canvas ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
  );
}

export default Scene;
