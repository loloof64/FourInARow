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

const DROP_COIN_START_Y = 35;

const dropAnimationIntervalMs = 10;

function Scene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [coins, setCoins] = useState<CoinType[][]>([]);
  const [movingCoinCol, setMovingCoinCol] = useState<number | null>(null);
  const [movingCoinY, setMovingCoinY] = useState<number | null>(null);
  const [movingCoinType, setMovingCoinType] = useState<CoinType | null>(null);
  const [movingCoinTargetY, setMovingCoinTargetY] = useState<number | null>(
    null
  );

  function dropCoin(col: number, type: CoinType) {
    if (coins.length === 0) return;
    setMovingCoinCol(col);
    setMovingCoinY(DROP_COIN_START_Y);
    setMovingCoinType(type);

    let filledHoles = 0;
    for (let j = 0; j < 6; j++) {
      if (coins[j][col] !== CoinType.UNSET) {
        filledHoles++;
      }
    }
    const targetLine = 5 - filledHoles;
    const targetY = SELECTION_HEIGHT + (targetLine + 0.5) * CELL_SIZE;
    setMovingCoinTargetY(targetY);
  }

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

    // Moving coin (part outside of the board)
    if (
      movingCoinCol !== null &&
      movingCoinY !== null &&
      movingCoinType !== null
    ) {
      ctx.fillStyle = movingCoinType === CoinType.RED ? "red" : "yellow";
      ctx.beginPath();
      ctx.arc(
        CELL_SIZE * (movingCoinCol + 0.5),
        movingCoinY,
        COIN_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

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

    // Coins
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const realRow = 5 - row;
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
          CELL_SIZE * (realRow + 0.5) + SELECTION_HEIGHT,
          COIN_SIZE / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Moving coin (part inside of the board)
    if (
      movingCoinCol !== null &&
      movingCoinY !== null &&
      movingCoinType !== null
    ) {
      ctx.fillStyle = movingCoinType === CoinType.RED ? "red" : "yellow";
      ctx.beginPath();
      ctx.arc(
        CELL_SIZE * (movingCoinCol + 0.5),
        movingCoinY,
        COIN_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.restore();
  }

  useEffect(() => {
    setCoins(getEmptyBoardData());
  }, []);

  useEffect(() => {
    drawBoard();
  }, [canvas, coins, movingCoinY]);

  //////////////////////
  useEffect(() => {
    dropCoin(3, CoinType.RED);
  }, [coins]);
  /////////////////////

  useEffect(() => {
    if (movingCoinY === null || movingCoinTargetY === null) return;

    const intervalId = setInterval(() => {
      setMovingCoinY((prevY) => {
        if (prevY === null) return null;
        const newY = prevY + 5;
        if (newY > movingCoinTargetY) {
          clearInterval(intervalId);
          setMovingCoinCol(null);
          setMovingCoinType(null);
          setMovingCoinTargetY(null);
          return movingCoinTargetY;
        }
        return newY;
      });
    }, dropAnimationIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [movingCoinY, movingCoinTargetY]);

  return (
    <canvas ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
  );
}

export default Scene;
