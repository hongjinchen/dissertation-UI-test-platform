import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Box, TextField } from '@mui/material';

const DraggableItem = ({ type, color, children, InputComponent }) => {
  const [inputValue, setInputValue] = useState('');

  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { type, inputValue },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log("input value",event.target.value);
  };

  const InputWrapper = () => (
    <InputComponent onChange={handleInputChange} value={inputValue} />
  );

  return (
    <Box
      ref={drag}
      sx={{
        padding: 1,
        margin: 1,
        borderRadius: 1,
        backgroundColor: color,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {children}
      {InputComponent && (
        <Box sx={{ marginTop: 1 }}>
          <InputWrapper />
        </Box>
      )}
    </Box>
  );
};

export default DraggableItem;
