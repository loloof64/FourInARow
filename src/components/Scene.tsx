import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

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

interface SceneProps {}

export interface SceneRef {
  dropNextCoin: () => void;
  moveCoinLeft: () => void;
  moveCoinRight: () => void;
}

const Scene = forwardRef<SceneRef, SceneProps>((_props, ref) => {
  useImperativeHandle(ref, () => ({
    dropNextCoin,
    moveCoinLeft,
    moveCoinRight,
  }));

  const canvas = useRef<HTMLCanvasElement>(null);
  const [coins, setCoins] = useState<CoinType[][]>([]);
  const [movingCoinCol, setMovingCoinCol] = useState<number | null>(null);
  const [movingCoinY, setMovingCoinY] = useState<number | null>(null);
  const [movingCoinType, setMovingCoinType] = useState<CoinType | null>(null);
  const [movingCoinTargetY, setMovingCoinTargetY] = useState<number | null>(
    null
  );
  const [nextCoinRow, setNextCoinRow] = useState<number | null>(null);
  const [waitingCoinCol, setWaitingCoinCol] = useState<number | null>(null);
  const [waitingCoinType, setWaitingCoinType] = useState<CoinType | null>(null);

  function dropNextCoin() {
    if (waitingCoinCol !== null && waitingCoinType !== null) {
      dropCoin(waitingCoinCol, waitingCoinType);
    }
  }

  function moveCoinLeft() {
    if (waitingCoinCol !== null && waitingCoinType !== null) {
      setWaitingCoinCol((prevCol) => {
        if (prevCol == null) return null;
        let newCol = prevCol - 1;
        if (newCol < 0) newCol = 6;
        return newCol;
      });
    }
  }

  function moveCoinRight() {
    if (waitingCoinCol !== null && waitingCoinType !== null) {
      setWaitingCoinCol((prevCol) => {
        if (prevCol == null) return null;
        let newCol = prevCol + 1;
        if (newCol > 6) newCol = 0;
        return newCol;
      });
    }
  }

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

    setWaitingCoinCol(null);
    setWaitingCoinType(null);

    setNextCoinRow(filledHoles);
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

  function updatedBoard(
    movingCoinType: CoinType,
    movingCoinCol: number,
    nextCoinRow: number
  ) {
    let newValue: CoinType[][] = coins;
    if (
      nextCoinRow !== null &&
      movingCoinCol !== null &&
      movingCoinType !== null
    ) {
      newValue[nextCoinRow][movingCoinCol] = movingCoinType;
    }
    return newValue;
  }

  function drawScene() {
    if (coins.length === 0) return;
    const ctx = canvas.current?.getContext("2d");
    if (ctx == null) return;

    // Selection zone
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, BOARD_WIDTH, SELECTION_HEIGHT);

    // Waiting coin
    if (waitingCoinCol !== null && waitingCoinType !== null) {
      ctx.fillStyle = waitingCoinType === CoinType.RED ? "red" : "yellow";
      ctx.beginPath();
      ctx.arc(
        CELL_SIZE * (waitingCoinCol + 0.5),
        SELECTION_HEIGHT / 2,
        COIN_SIZE / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

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
    drawScene();
  }, [canvas, coins, movingCoinY, waitingCoinCol, waitingCoinType]);

  useEffect(() => {
    setWaitingCoinCol(0);
    setWaitingCoinType(CoinType.RED);
  }, []);

  useEffect(() => {
    if (movingCoinY === null || movingCoinTargetY === null) return;

    const intervalId = setInterval(() => {
      setMovingCoinY((prevY) => {
        if (
          prevY === null ||
          movingCoinType === null ||
          movingCoinCol === null ||
          nextCoinRow === null
        )
          return null;
        const newY = prevY + 5;
        if (newY > movingCoinTargetY) {
          clearInterval(intervalId);
          const newBoardArray = updatedBoard(
            movingCoinType,
            movingCoinCol,
            nextCoinRow
          );
          setCoins(newBoardArray);
          setNextCoinRow(null);
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
});

export default Scene;
