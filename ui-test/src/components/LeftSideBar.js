import React,{useState} from 'react';
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
          onInputChange={(value) => {
            if (command.type === 'Given') {
              setGivenId(Date.now());
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
