import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { clsx } from 'clsx'

import styles from './Maze.module.css'

interface MazeProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: number,
    height?: number,
    threshold?: number
}

interface MazeState {
    maze: number[],
    currentCell: number,
    branchPoints: number[],
    done: boolean,
    animationFrameId: number
}

const UP = 1;
const DOWN = 2;
const LEFT = 4;
const RIGHT = 8;

const availableCellsFn = (width: number, height: number) => (maze: number[], from: number) => {
    const left = from % width === 0 ? -1 : from - 1;
    const right = (from + 1) % width === 0 ? -1 : from + 1;
    const up = from - width < 0 ? -1 : from - width;
    const down = from + width >= width * height ? -1 : from + width;

    const dirs = [
        [UP, up],
        [DOWN, down],
        [LEFT, left],
        [RIGHT, right],
    ].filter(([, v]) => v > -1 && !maze[v])

    const directions = Object.fromEntries(dirs);

    return { directions, length: dirs.length };
}

const useGenerateMaze = (width: number, height: number, threshold: number) => {
    const initialState = useCallback(() => ({
        branchPoints: [] as number[],
        done: false,
        currentCell: Math.floor(Math.random() * (width * height)),
        maze: Array.from({ length: width * height }, () => 0),
        animationFrameId: -1
    }), [width, height])

    const refState = useRef(initialState());
    const restart = useCallback(() => {
        refState.current.animationFrameId && cancelAnimationFrame(refState.current.animationFrameId);
        refState.current = initialState();
        refState.current.animationFrameId = requestAnimationFrame(update);
    }, [initialState]);

    const [mazeState, setMazeState] = useState([...refState.current.maze]);
    const availableCells = availableCellsFn(width, height);

    const update = useCallback((time: DOMHighResTimeStamp) => {
        const { branchPoints, done, currentCell, maze } = refState.current;
        if (done || Math.random() > threshold) {
            restart();
        }
        if (done) {
            console.log('done', maze[0], maze[0] | UP, { UP, DOWN, LEFT, RIGHT })
            maze[0] |= UP;
            maze[maze.length - 1] |= DOWN;
            setMazeState([...maze]);
            return;
        };

        const { directions, length } = availableCells(maze, currentCell);

        if (length === 0) {
            let next = branchPoints.shift() as number;
            while (!availableCells(maze, next).length && branchPoints.length) {
                next = branchPoints.shift() as number;
            }
            refState.current = { ...refState.current, branchPoints, done: !next, currentCell: next, maze };
            refState.current.animationFrameId = requestAnimationFrame(update);
            return;
        }

        if (length > 1) {
            branchPoints.push(currentCell);
        }
        const entries = Object.entries(directions);
        const [d, nextCell] = entries[Math.floor(Math.random() * length)];
        maze[currentCell] += Number(d);
        maze[nextCell as number] += Number(d) === UP ? DOWN : Number(d) === DOWN ? UP : Number(d) === LEFT ? RIGHT : LEFT;
        refState.current = { ...refState.current, branchPoints, currentCell: nextCell as number, maze };
        setMazeState([...maze]);
        refState.current.animationFrameId = requestAnimationFrame(update);
    }, [])

    useEffect(() => void update(0), [])

    return mazeState;
}


export function Maze({ width = 20, height = width, threshold = .999, children }: MazeProps) {
    const maze = useGenerateMaze(width, height, threshold);
    return (
        <section className={styles.maze}>
            <div style={{ display: 'grid', gridTemplate: `repeat(${height}, 1fr) / repeat(${width}, 1fr)` }}>
                {maze.map((cell, i) => <Cell key={i} value={cell} />)}
            </div>
            <div>{children}</div>
        </section>
    )
}

function Cell({ value }: { value: number }) {
    return (
        <div className={clsx(styles.cell, {
            [styles.up]: value & UP,
            [styles.down]: value & DOWN,
            [styles.left]: value & LEFT,
            [styles.right]: value & RIGHT,
            [styles.visited]: !!value
        })}></div>
    )
}