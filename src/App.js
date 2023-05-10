import React, { Component } from "react";

import ControlPanel from "./containers/ControlPanel/ControlPanel";
import Workspace from "./containers/Workspace/Workspace";
import CommandListPanel from "./containers/CommandListPanel/CommandListPanel";

import ControlContext from "./contexts/control-context";
import { genId, defaultValues } from "./shared/util";

import CreateObjectCommandObject from "./shared/commandObjects/CreateObjectCommandObject";
import ChangeFillColorCommandObject from "./shared/commandObjects/ChangeFillColorCommandObject";
import ChangeBorderColorCommandObject from "./shared/commandObjects/ChangeBorderColorCommandObject";
import ChangeBorderWidthCommandObject from "./shared/commandObjects/ChangeBorderWidthCommandObject";
import DeleteObjectCommandObject from "./shared/commandObjects/DeleteObjectCommandObject";
import MovingObjectCommandObject from "./shared/commandObjects/MovingObjectCommndObject";

import "./App.css";

class App extends Component {
  state = {
    // controls
    currMode: defaultValues.mode,
    currBorderColor: defaultValues.borderColor,
    currBorderWidth: defaultValues.borderWidth,
    currFillColor: defaultValues.fillColor,
    borderWidthMouseDown: false,
    movingObjectMouseDown: false,

    // workspace
    shapes: [],
    shapesMap: {},
    selectedShapeId: undefined,

    // handling undo/redo
    commandList: [],
    currCommand: -1,
    tmpCommand: null,
  };

  constructor() {
    super();

    /*
     * pass this undoHandler into command object constructors:
     *  e.g. let cmdObj = new ChangeFillColorCommandObject(this.undoHandler);
     */
    this.undoHandler = {
      registerExecution: this.registerExecution,
      // TODO: fill this up with whatever you need for the command objects
      updateShape: this.updateShape,
    };
    
  }
  
  /*
   * TODO:
   * add the commandObj to the commandList so
   * that is available for undoing.
   */
  registerExecution = (commandObject) => {
    let commandList = [...this.state.commandList];
    commandList.splice(this.state.currCommand + 1);
    commandList.push(commandObject);
    this.setState({
      commandList: commandList,
      currCommand: this.state.currCommand + 1,
    });
  };
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'z') {
      this.undo();
    }
    else if (e.ctrlKey && e.key === 'y') {
      this.redo();
    }
  }
  
  /*
   * TODO:
   * actually call the undo method of the command at
   * the current position in the undo stack
   */

  canUndo = () => {
    if (this.state.currCommand >= 0) return true;
    return false;
  }

  undo = () => {
    console.log("undo");
    // console.log('this.state, ',  this.state);
    // console.log('shapes, ', this.state.shapes.map((shapeId) => {
    //   return this.state.shapesMap[shapeId];
    // }))
    // let command = this.state.commandList[this.state.currCommand];
    if (this.canUndo()) {
      let cmdObj = this.state.commandList[this.state.currCommand];
      cmdObj.undo(this.state, (state) => {this.setState(state)});
      // console.log('cmdObj, ', cmdObj);
      this.setState({
        currCommand: this.state.currCommand - 1,
        // selectedShapeId: (cmdObj.targetObject || {}).id,
      });
      this.changeCurrMode('select');
    }
    
    // () => {
    //   if (cmdObj.targetObject.visible)
    //     this.selectShape((cmdObj.targetObject || {}).id);
    // }

    // let currCommand = this.state.currCommand - 1;
  };

  /*
   * TODO:
   * actually call the redo method of the command at
   * the current position in the undo stack. Note that this is
   * NOT the same command as would be affected by a doUndo()
   */

  canRedo = () => {
    if (this.state.currCommand + 2 <= this.state.commandList.length) return true;
    return false;
  }

  redo = () => {
    console.log("redo");
    if (this.canRedo()) {
      let cmdObj = this.state.commandList[this.state.currCommand + 1];
      cmdObj.redo(this.state, (state) => {this.setState(state)});
      this.setState({
        currCommand: this.state.currCommand + 1,
        selectedShapeId: (cmdObj.targetObject || {}).id,
      }, () => {
        this.selectShape((cmdObj.targetObject || {}).id);
      });
      this.changeCurrMode('select');
    }
  };

  canRepeat = () => {
    if (this.state.currCommand !== -1)
      return this.state.commandList[this.state.currCommand].canRepeat(this.state);
    return false;
  }

  repeat = () => {
    if (this.canRepeat())
      this.state.commandList[this.state.currCommand].repeat();
  }

  // add the shapeId to the array, and the shape itself to the map
  addShape = (shapeData) => {
    let shapes = [...this.state.shapes];
    let shapesMap = { ...this.state.shapesMap };
    const id = genId();
    shapesMap[id] = {
      ...shapeData,
      id,
    };
    shapes.push(id);
    // this.setState({ shapes, shapesMap, selectedShapeId: id });
    this.setState({ shapes, shapesMap }, () => {
      let cmdObj = new CreateObjectCommandObject(this.undoHandler, id, this.state, this.updateShape, this.selectShape, this.addShape, shapeData);
      cmdObj.execute();
    });

  };

  // get the shape by its id, and update its properties
  updateShape = (shapeId, newData) => {
    let shapesMap = { ...this.state.shapesMap };
    let targetShape = shapesMap[shapeId];
    // console.log('before: shapesMap[shapeId], ', shapesMap[shapeId]);
    shapesMap[shapeId] = { ...targetShape, ...newData };
    // console.log('after: shapesMap[shapeId], ', shapesMap[shapeId]);
    this.setState({ shapesMap });
  };

  moveShape = (newData) => {
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, newData);
    }
  };

  setMovingObjectMouseDown = (movingObjectMouseDown, targetId, newData) => {
    if (targetId && (targetId !== 'workspace-svg')) {
      if (movingObjectMouseDown) {
        // console.log('init pos: ', newData.x, newData.y);
        let cmdObj = new MovingObjectCommandObject(this.undoHandler, this.state.shapesMap[targetId], newData)
        if (cmdObj.canExecute()) cmdObj.execute();
        this.setState({ tmpCommand: cmdObj });
      }
      else {
        // console.log('final pos: ', newData.x, newData.y);
        this.state.tmpCommand.setNewMouseUpPoint(newData);
      }
    }
    this.setState({ movingObjectMouseDown: movingObjectMouseDown });
  }

  // deleting a shape sets its visibility to false, rather than removing it
  deleteSelectedShape = () => {
    let shapesMap = { ...this.state.shapesMap };
    shapesMap[this.state.selectedShapeId].visible = false;
    if (this.state.selectedShapeId) {
      let cmdObj = new DeleteObjectCommandObject(this.undoHandler, this.state.selectedShapeId, this.state, this.updateShape, this.selectShape, this.deleteSelectedShape);
      if (cmdObj.canExecute()) cmdObj.execute();
    }
    this.setState({ shapesMap, selectedShapeId: undefined });
  };

  changeCurrMode = (mode) => {
    if (mode === "line") {
      this.setState({
        currMode: mode,
        currBorderColor: defaultValues.borderColor,
      });
    } else {
      this.setState({ currMode: mode });
    }
    if (mode !== "select") this.setState({ selectedShapeId: undefined });
  };

  changeCurrBorderColor = (borderColor) => {
    this.setState({ currBorderColor: borderColor });
    if (this.state.selectedShapeId) {
      let cmdObj = new ChangeBorderColorCommandObject(this.undoHandler, this.state, borderColor, this.changeCurrBorderColor);
      if (cmdObj.canExecute()) cmdObj.execute();
      this.updateShape(this.state.selectedShapeId, { borderColor });
    }
  };

  changeCurrBorderWidth = (borderWidth) => {
    this.setState({ currBorderWidth: borderWidth });
    if (this.state.selectedShapeId) {
      this.updateShape(this.state.selectedShapeId, { borderWidth });
    }
  };

  setBorderWidthMouseDown = (borderWidthMouseDown, borderWidth) => {
    if (this.state.selectedShapeId) {
      if (borderWidthMouseDown) {
        let cmdObj = new ChangeBorderWidthCommandObject(this.undoHandler, this.state, this.setBorderWidthMouseDown, this.changeCurrBorderWidth);
        if (cmdObj.canExecute()) cmdObj.execute();
      }
      else {
        this.state.commandList[this.state.currCommand].setNewValue(borderWidth);
      }
    }
    this.setState({ borderWidthMouseDown: borderWidthMouseDown});
    // console.log('setting ', borderWidthMouseDown);
  }

  getBorderWidthMouseDown = () => {
    return this.state.borderWidthMouseDown;
  }

  changeCurrFillColor = (fillColor) => {
    this.setState({ currFillColor: fillColor });
    if (this.state.selectedShapeId) {
      let cmdObj = new ChangeFillColorCommandObject(this.undoHandler, this.state, fillColor, this.changeCurrFillColor);
      if (cmdObj.canExecute()) cmdObj.execute();
      this.updateShape(this.state.selectedShapeId, { fillColor });
    }
  };

  selectShape = (id) => {
    this.setState({ selectedShapeId: id });
    if (id) {
      const { borderColor, borderWidth, fillColor } = this.state.shapesMap[
        this.state.shapes.filter((shapeId) => shapeId === id)[0]
      ];
      this.setState({
        currBorderColor: borderColor,
        currBorderWidth: borderWidth,
        currFillColor: fillColor,
      });
    }
  }

  render() {
    const {
      currMode,
      currBorderColor,
      currBorderWidth,
      currFillColor,
      shapes,
      shapesMap,
      selectedShapeId,
      commandList,
      currCommand,
    } = this.state;

    // update the context with the functions and values defined above and from state
    // and pass it to the structure below it (control panel and workspace)
    return (
      <React.Fragment>
        <ControlContext.Provider
          value={{
            currMode,
            changeCurrMode: this.changeCurrMode,
            currBorderColor,
            changeCurrBorderColor: this.changeCurrBorderColor,
            currBorderWidth,
            changeCurrBorderWidth: this.changeCurrBorderWidth,
            setBorderWidthMouseDown: this.setBorderWidthMouseDown,
            getBorderWidthMouseDown: this.getBorderWidthMouseDown,
            currFillColor,
            changeCurrFillColor: this.changeCurrFillColor,

            shapes,
            shapesMap,
            addShape: this.addShape,
            moveShape: this.moveShape,
            selectedShapeId,
            selectShape: this.selectShape,
            deleteSelectedShape: this.deleteSelectedShape,
            setMovingObjectMouseDown: this.setMovingObjectMouseDown,

            commandList: commandList,
            currCommand: currCommand,

            undo: this.undo,
            redo: this.redo,
            repeat: this.repeat,
            canUndo: this.canUndo,
            canRedo: this.canRedo,
            canRepeat: this.canRepeat,
          }}
        >
          <ControlPanel />
          <Workspace />
          <CommandListPanel/>
        </ControlContext.Provider>
      </React.Fragment>
    );
  }
}

export default App;
