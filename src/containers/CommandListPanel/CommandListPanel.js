import React, { useContext } from "react";

import ControlContext from "../../contexts/control-context";

import "./CommandListPanel.css";

const Command = ({verbose, state}) => {
  return (
    <div className={`${state}Command Command`}>
      <p>
        {verbose}
      </p>
    </div>
  )
}

const CommandListPanel = () => {
  const {
    commandList,
    currCommand,
  } = useContext(ControlContext);

  return (
    <div className="CommandListPanel">
      {commandList.map((command, id) => {
        if (id > currCommand)       return <del key={id}> <Command verbose={command.verbose} state='undone'/> </del>
        else if (id === currCommand) return <Command key={id} verbose={command.verbose} state='current'/>
        else                        return <Command key={id} verbose={command.verbose} state='done'/>
      })}
    </div>
  )
}

export default CommandListPanel;