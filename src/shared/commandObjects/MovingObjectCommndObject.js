import CommandObject from "./CommandObject";

export default class MovingObjectCommandObject extends CommandObject {
  constructor(undoHandler, obj, data, repeated = false) {
    super(undoHandler, true);
    this.selectedObj = obj;
    this.verbose = `Moving ${this.selectedObj.type}`;
    this.mouseDownPoint = data;
    this.mouseUpPoint = data;
    this.registered = false;
  }

  canExecute() {
    return this.selectedObj !== null; // global variable for selected
  }

  execute() {
    if (this.selectedObj !== null) {
      this.targetObject = this.selectedObj;
      this.oldValue = { initCoords: this.targetObject.initCoords, finalCoords: this.targetObject.finalCoords };
    }
  }

  setNewMouseUpPoint(newData) {
    // this.verbose = `MovingObj ${this.oldValue} to ${newData}`;
    this.mouseUpPoint = newData;
    let deltaX = this.mouseUpPoint.x - this.mouseDownPoint.x;
    let deltaY = this.mouseUpPoint.y - this.mouseDownPoint.y;
    this.newValue = { 
      initCoords: {
        x: this.oldValue.initCoords.x + deltaX,
        y: this.oldValue.initCoords.y + deltaY
      },
      finalCoords: {
        x: this.oldValue.finalCoords.x + deltaX,
        y: this.oldValue.finalCoords.y + deltaY
      }
    };
    if (this.addToUndoStack && (deltaX !== 0) && (deltaY !== 0) && !this.registered) {
      this.undoHandler.registerExecution(this);
      this.registered = true
    }
  }

  undo() {
    this.undoHandler.updateShape(this.targetObject.id, this.oldValue);

    // maybe also need to fix the palette to show this object's color?
  }

  redo() {
    // let shapesMap = { ...state.shapesMap };
    // let id = this.id;
    // shapesMap[id].visible = true;
    // setState({ shapesMap, selectedShapeId: id });
    this.undoHandler.updateShape(this.targetObject.id, this.newValue);
  }

  repeat() {
  }
}