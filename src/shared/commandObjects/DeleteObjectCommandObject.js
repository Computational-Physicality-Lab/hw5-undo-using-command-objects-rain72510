import CommandObject from "./CommandObject";

export default class DeleteObjectCommandObject extends CommandObject {
  constructor(undoHandler, id, state, updateShape, selectShape, deleteSelectedShape) {
    super(undoHandler, true, deleteSelectedShape);
    this.id = id;
    this.targetObject = state.shapesMap[id];
    this.verbose = `Delete ${this.targetObject.type}`;
    this.updateShape = updateShape;
    this.selectShape = selectShape;
  }

  canExecute() {
    return this.selectedObj !== null; // global variable for selected
  }

  execute() {
      
      if (this.addToUndoStack) this.undoHandler.registerExecution(this);
  }

  undo() {
    this.updateShape(this.id, {visible: true});
    this.selectShape(this.id);

    // maybe also need to fix the palette to show this object's color?
  }

  redo() {
    this.updateShape(this.id, {visible: false});
    this.selectShape(undefined);
  }

  canRepeat(state) {
    return state.selectedShapeId !== undefined;
  }

  repeat() {
    this.repeatMethod();
  }
}