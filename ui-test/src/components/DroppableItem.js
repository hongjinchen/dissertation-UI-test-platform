import React from 'react';
import { useDrag } from 'react-dnd';
import { Box } from '@mui/material';

const DroppableItem = ({ type, inputValue, children, index, onDelete, parentId }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'DROPPABLE_ITEM',
      item: { type, inputValue, index, parentId },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
  

  return (
    <Box
      ref={drag}
      sx={{
        backgroundColor: type === 'Given' ? 'orange' : 'transparent',
        borderRadius: 1,
        padding: 1,
        margin: 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {type}: {inputValue}
      {children}
    </Box>
  );
};

export default DroppableItem;
