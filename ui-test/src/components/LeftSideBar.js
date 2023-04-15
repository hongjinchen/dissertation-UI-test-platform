// LeftSideBar.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import DraggableItem from './DraggableItem';
import { commandsConfig } from '../commandsConfig';

const LeftSideBar = () => {
  const [givenId, setGivenId] = useState(null);
  
  return (
    <Box
      sx={{
        width: 250,
        minHeight: '100vh',
        backgroundColor: 'grey.200',
        padding: 2,
      }}
    >
      {commandsConfig.map((command, index) => (
        <DraggableItem
          key={index}
          type={command.type}
          color={command.color}
          InputComponent={command.InputComponent}
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
    </Box>
  );
};

export default LeftSideBar;
