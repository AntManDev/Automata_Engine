import React from 'react';

const AdvancedControls = ({
  running,
  speed,
  setSpeed,
  selectedState,
  setSelectedState,
  gridType,
  setGridType,
  exportGrid,
  importGrid
}) => {
  return (
    <div style={{ marginTop: '10px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
      <div>
        <label>
          Speed: {speed} ms
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>
          Paint State:
          <input
            type="number"
            min="0"
            max="10"
            value={selectedState}
            onChange={(e) => setSelectedState(Number(e.target.value))}
            style={{ width: '50px', marginLeft: '10px' }}
          />
        </label>
        <small> (0 = empty, 1+ = alive/other states)</small>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>
          Grid Type:
          <select value={gridType} onChange={(e) => setGridType(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="square">Square</option>
            <option value="hex">Hex</option>
            <option value="triangle">Triangle</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: '10px' }}>
        <button onClick={exportGrid}>Export Grid</button>
        <button onClick={importGrid} style={{ marginLeft: '10px' }}>Import Grid</button>
      </div>
    </div>
  );
};

export default AdvancedControls;
