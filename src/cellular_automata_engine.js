/**
 * Cellular Automata Engine
 * Supports dynamic rule changes (GUI or config), multi-state cells, different grids, and saving/loading.
 * Optimized for real-time performance, but flexible for experimentation.
 */

// Basic setup
class CellularAutomataEngine {
    constructor(config) {
      this.width = config.width;
      this.height = config.height;
      this.gridType = config.gridType || 'square'; // 'square', 'hex', 'triangle'
      this.states = config.states || 2; // Number of possible states per cell
      this.rules = config.rules || this.defaultRules();
      this.grid = this.createGrid();
      this.history = [];
    }
  
    defaultRules() {
      // Basic Game of Life example rules as placeholder
      return {
        survive: [2, 3],
        born: [3]
      };
    }
  
    createGrid() {
      const grid = [];
      for (let y = 0; y < this.height; y++) {
        grid[y] = [];
        for (let x = 0; x < this.width; x++) {
          grid[y][x] = 0; // Start as "dead" or lowest state
        }
      }
      return grid;
    }
  
    setRules(newRules) {
      this.rules = newRules;
    }
  
    updateCell(x, y, state) {
      if (this.isValid(x, y)) {
        this.grid[y][x] = state;
      }
    }
  
    isValid(x, y) {
      return y >= 0 && y < this.height && x >= 0 && x < this.width;
    }
  
    getNeighborStates(x, y) {
      const directions = this.getNeighborDirections();
      const neighborStates = [];
  
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (this.isValid(nx, ny)) {
          neighborStates.push(this.grid[ny][nx]);
        }
      }
      return neighborStates;
    }
  
    getNeighborDirections() {
      if (this.gridType === 'hex') {
        return [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
      } else if (this.gridType === 'triangle') {
        return [[1, 0], [-1, 0], [0, 1], [0, -1]];
      }
      // Default to square
      return [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0],           [1, 0],
        [-1, 1],  [0, 1],  [1, 1]
      ];
    }
  
    step() {
      const newGrid = this.createGrid();
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const currentState = this.grid[y][x];
          const neighborStates = this.getNeighborStates(x, y);
          const aliveNeighbors = neighborStates.filter(s => s > 0).length;
  
          if (this.rules.survive.includes(aliveNeighbors) && currentState > 0) {
            newGrid[y][x] = currentState;
          } else if (this.rules.born.includes(aliveNeighbors) && currentState === 0) {
            newGrid[y][x] = 1;
          } else {
            newGrid[y][x] = 0;
          }
        }
      }
      this.history.push(this.grid);
      this.grid = newGrid;
    }
  
    saveState() {
      return JSON.stringify(this.grid);
    }
  
    loadState(stateString) {
      const loaded = JSON.parse(stateString);
      if (loaded.length === this.height && loaded[0].length === this.width) {
        this.grid = loaded;
      }
    }
  }
  
  export default CellularAutomataEngine;
  