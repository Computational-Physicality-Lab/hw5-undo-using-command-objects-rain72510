import CommandObject from "./CommandObject";

export default class ChangeBorderColorCommandObject extends CommandObject {
  constructor(undoHandler, state, borderColor, changeCurrBorderColor) {
    super(undoHandler, true, changeCurrBorderColor);
    this.selectedObj = state.shapesMap[state.selectedShapeId];
    this.borderColor = borderColor;
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
      this.oldValue = this.targetObject.borderColor; // object's current color
      this.newValue = this.borderColor; // get the color widget's current color
      this.targetObject.borderColor = this.newValue; // actually change
      this.verbose = `Change ${this.targetObject.type} border color to ${this.newValue}`;
      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      if (this.addToUndoStack) this.undoHandler.registerExecution(this);
    }
  }

  /* override to undo the operation of this command
   */
  undo() {
    this.targetObject.borderColor = this.oldValue;
    // maybe also need to fix the palette to show this object's color?
    this.undoHandler.updateShape(this.targetObject.id, { 'borderColor': this.oldValue });
  }

  /* override to redo the operation of this command, which means to
   * undo the undo. This should ONLY be called if the immediate
   * previous operation was an Undo of this command. Anything that
   * can be undone can be redone, so there is no need for a canRedo.
   */
  redo() {
    this.targetObject.borderColor = this.newValue;
    // maybe also need to fix the palette to show this object's color?
    this.undoHandler.updateShape(this.targetObject.id, { 'borderColor': this.newValue });
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
    this.repeatMethod(this.borderColor);
  }
}
