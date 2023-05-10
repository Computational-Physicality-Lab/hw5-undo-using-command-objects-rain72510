import CommandObject from "./CommandObject";

export default class ChangeBorderWidthCommandObject extends CommandObject {
  constructor(undoHandler, state, setBorderWidthMouseDown, changeCurrBorderWidth) {
    super(undoHandler, true, setBorderWidthMouseDown);
    this.selectedObj = state.shapesMap[state.selectedShapeId];
    this.verbose = `Change ${this.selectedObj.type} border width`;
    this.state = state;
    this.changeCurrBorderWidth = changeCurrBorderWidth;
  }

  canExecute() {
    return this.selectedObj !== null; // global variable for selected
  }

  execute() {
    this.targetObject = this.selectedObj; // global variable for selected
    this.oldValue = this.targetObject.borderWidth;
    this.newValue = this.width;
    this.targetObject.borderWidth = this.newValue;
    if (this.addToUndoStack) this.undoHandler.registerExecution(this);
  }

  setNewValue(newValue) {
    this.verbose = `Change ${this.targetObject.type} border width to ${newValue}`;
    this.newValue = newValue;
  }

  undo() {
    this.targetObject.borderWidth = this.oldValue;
    this.undoHandler.updateShape(this.targetObject.id, { 'borderWidth': this.oldValue });
  }

  redo() {
    this.targetObject.borderWidth = this.newValue;
    this.undoHandler.updateShape(this.targetObject.id, { 'borderWidth': this.newValue });
  }

  canRepeat(state) {
    return state.selectedShapeId !== undefined;
  }

  async repeat() {
    // let cmdObj = new ChangeBorderWidthCommandObject(this.undoHandler, this.state);
    // if (cmdObj.canExecute()) cmdObj.execute();
    // cmdObj.setNewValue(this.newValue);
    // this.repeatMethod(this.newValue);
    await this.repeatMethod(true, 0);
    this.repeatMethod(false, this.newValue);
    this.changeCurrBorderWidth(this.newValue);
  }
}