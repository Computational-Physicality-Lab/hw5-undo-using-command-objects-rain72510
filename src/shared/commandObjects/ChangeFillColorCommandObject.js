import CommandObject from "./CommandObject";

export default class ChangeFillColorCommandObject extends CommandObject {
  constructor(undoHandler, state, fillColor, changeCurrFillColor) {
    super(undoHandler, true, changeCurrFillColor);
    this.selectedObj = state.shapesMap[state.selectedShapeId];
    this.fillColor = fillColor;
  }

  /* override to return true if this command can be executed,
   *  e.g., if there is an object selected
   */
  canExecute() {
    return this.selectedObj !== null; // global variable for selected
  }

  /* override to execute the action of this command.
   * pass in false for addToUndoStack if this is a command which is NOT
   * put on the undo stack, like Copy, or a change of selection or Save
   */
  execute() {
    if (this.selectedObj !== null) {
      this.targetObject = this.selectedObj; // global variable for selected
      this.oldValue = this.targetObject.fillColor; // object's current color
      this.newValue = this.fillColor; // get the color widget's current color
      this.targetObject.fillColor = this.newValue; // actually change
      this.verbose = `Change ${this.targetObject.type} border width to ${this.newValue}`;


      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution(this);
      // console.log(this);
    }
  }

  /* override to undo the operation of this command
   */
  undo() {
    this.targetObject.fillColor = this.oldValue;
    // maybe also need to fix the palette to show this object's color?
    this.undoHandler.updateShape(this.targetObject.id, { 'fillColor': this.oldValue });
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo() {
    this.targetObject.fillColor = this.newValue;
    // maybe also need to fix the palette to show this object's color?
    this.undoHandler.updateShape(this.targetObject.id, { 'fillColor': this.newValue });
  }

  /* override to return true if this operation can be repeated in the
   * current context
   */
  canRepeat(state) {
    return state.selectedShapeId !== undefined;
  }

  /* override to execute the operation again, this time possibly on
   * a new object. Thus, this typically uses the same value but a new
   * selectedObject.
   */
  repeat() {
    this.repeatMethod(this.fillColor);
  }
}
