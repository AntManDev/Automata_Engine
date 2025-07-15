import React, { useEffect, useRef, useState } from 'react';
import CellularAutomataEngine from './cellular_automata_engine.js';

const CELL_SIZE = 15;
const WIDTH = 40;
const HEIGHT = 30;

const CellularAutomataGUI = () => {
  const canvasRef = useRef(null);
  const [engine, setEngine] = useState(null);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const config = {
      width: WIDTH,
      height: HEIGHT,
      gridType: 'square',
      states: 2,
      rules: {
        survive: [2, 3],
        born: [3]
      }
    };
    const eng = new CellularAutomataEngine(config);
    randomizeGrid(eng);
    setEngine(eng);
  }, []);

  const drawGrid = () => {
    if (!engine || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE);
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (engine.grid[y][x] > 0) {
          ctx.fillStyle = 'black';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else {
          ctx.strokeStyle = '#eee';
          ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  };

  useEffect(() => {
    drawGrid();
  }, [engine]);

  const toggleRun = () => {
    if (running) {
      clearInterval(intervalId);
      setIntervalId(null);
      setRunning(false);
    } else {
      const id = setInterval(() => {
        engine.step();
        drawGrid();
      }, 100);
      setIntervalId(id);
      setRunning(true);
    }
  };

  const clearGrid = () => {
    engine.grid = engine.createGrid();
    drawGrid();
  };

  const randomizeGrid = (eng = engine) => {
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        eng.updateCell(x, y, Math.random() > 0.7 ? 1 : 0);
      }
    }
    drawGrid();
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    engine.updateCell(x, y, engine.grid[y][x] ? 0 : 1);
    drawGrid();
  };

  const handleRuleChange = (e) => {
    const [survive, born] = e.target.value.split('/').map(str =>
      str.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
    );
    engine.setRules({ survive, born });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={WIDTH * CELL_SIZE}
        height={HEIGHT * CELL_SIZE}
        style={{ border: '1px solid black' }}
        onClick={handleCanvasClick}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={toggleRun}>{running ? 'Pause' : 'Start'}</button>
        <button onClick={clearGrid}>Clear</button>
        <button onClick={randomizeGrid}>Randomize</button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Rules (survive/born):&nbsp;
          <input
            type="text"
            defaultValue="2,3/3"
            onBlur={handleRuleChange}
            style={{ width: '100px' }}
          />
        </label>
        <small> (e.g., "2,3/3" for classic Life)</small>
      </div>
    </div>
  );
};

export default CellularAutomataGUI;
