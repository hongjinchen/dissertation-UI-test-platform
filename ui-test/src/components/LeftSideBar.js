// LeftSideBar.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import DraggableItem from './DraggableItem';
import { commandsConfig } from '../commandsConfig';
import { Button } from '@material-ui/core';
import { getItemColor } from "../utils";

function groupByType(commands) {
  return commands.reduce((acc, command) => {
    if (!acc[command.type]) {
      acc[command.type] = [];
    }
    acc[command.type].push(command);
    return acc;
  }, {});
}
const LeftSideBar = () => {
  const [givenId, setGivenId] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  
  const groupedCommands = groupByType(commandsConfig);

  return (
    <Box
      sx={{
        width: 350,
        minHeight: '100vh',
        backgroundColor: 'grey.200',
        padding: 2,
      }}
    >
      {Object.keys(groupedCommands).map(type => (
        <div key={type}>
          <Button
            fullWidth
            style={{
              backgroundColor: getItemColor(type),
              marginBottom: 10,
              color: 'white'
            }}
            onClick={() => setExpandedType(prevType => prevType === type ? null : type)}
          >
            {type}
          </Button>
          {expandedType === type && groupedCommands[type].map((command, index) => (
            <DraggableItem
              key={index}
              type={command.type}
              color={command.color}
              InputComponent={command.InputComponent}
              subType={command.subType} 
              params={command.params}
              onDragBegin={() => {
                if (command.type === 'Given') {
                  const newGivenId = Date.now();
                  setGivenId(newGivenId);
                }
              }}
              parentId={command.type === 'Given' ? null : givenId}
            >
              {command.label}
            </DraggableItem>
          ))}
        </div>
      ))}
    </Box>
  );
};


export default LeftSideBar;
