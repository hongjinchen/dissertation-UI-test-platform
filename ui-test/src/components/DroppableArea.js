import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Box, Typography } from '@mui/material';

const DroppableArea = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['Given', 'When', 'Then'],
    drop: (item) => {
      if (item.type === 'Given') {
        setDroppedItems((items) => [
          ...items,
          { type: item.type, children: [], inputValue: item.inputValue },
        ]);
      } else {
        setDroppedItems((items) =>
          items.map((it) =>
            it.type === 'Given'
              ? {
                  ...it,
                  children: [...it.children, { type: item.type, inputValue: item.inputValue }],
                }
              : it,
          ),
        );
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        backgroundColor: isOver ? 'lightblue' : 'white',
        padding: 2,
      }}
    >
      {droppedItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: item.type === 'Given' ? 'orange' : 'transparent',
            borderRadius: 1,
            padding: 1,
            margin: 1,
          }}
        >
          {item.type}: {item.inputValue}
          {item.children.map((child, idx) => (
            <Box key={idx} sx={{ marginLeft: 2 }}>
              {child.type}: {child.inputValue}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default DroppableArea;
