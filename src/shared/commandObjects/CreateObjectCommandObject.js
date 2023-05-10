import CommandObject from "./CommandObject";

export default class CreateObjectCommandObject extends CommandObject {
  constructor(undoHandler, id, state, updateShape, selectShape, addShape, shapeData) {
    super(undoHandler, true, addShape);
    this.id = id;
    this.targetObject = state.shapesMap[id];
    this.verbose = `Create ${this.targetObject.type}`;
    // this.addShape = addShape;
    this.shapeData = shapeData;
    this.updateShape = updateShape;
    this.selectShape = selectShape;
  }

  canExecute() {
    return true;
  }

  execute() {
      // this.targetObject = selectedObj; // global variable for selected
      // this.oldValue = selectedObj.fillColor; // object's current color
      // this.newValue = fillColorWidget.currentColor; // get the color widget's current color
      // selectedObj.fillColor = this.newValue; // actually change

      // Note that this command object must be a NEW command object so it can be
      // registered to put it onto the stack
      
      if (this.addToUndoStack) this.undoHandler.registerExecution(this);
  }

  undo() {
    this.updateShape(this.id, {visible: false});
    this.selectShape(undefined);

    // maybe also need to fix the palette to show this object's color?
  }

  redo() {
    this.updateShape(this.id, {visible: true});
    this.selectShape(this.id);
  }

  canRepeat() {
    return true;
  }

  repeat() {
    this.repeatMethod(this.shapeData);
  }
}