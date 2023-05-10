import { createContext } from "react";

// create a context with default values
const controlContext = createContext({
  currMode: "",
  changeCurrMode: () => {},
  currBorderColor: "",
  changeCurrBorderColor: () => {},
  currBorderWidth: 1,
  changeCurrBorderWidth: () => {},
  setBorderWidthMouseDown: () => {},
  getBorderWidthMouseDown: () => {},
  currFillColor: "",
  changeCurrFillColor: () => {},

  shapes: [],
  shapesMap: {},
  commandList: [],
  currCommand: -1,
  addShape: () => {},
  moveShape: () => {},
  selectedShapeId: "", // a string or undefined
  selectShape: () => {},
  deleteSelectedShape: () => {},
  setMovingObjectMouseDown: () => {},

  undo: () => {},
  redo: () => {},
  repeat: () => {},
  canUndo: () => {},
  canRedo: () => {},
  canRepeat: () => {},
});

export default controlContext;
