import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box } from '@mui/material';
import LeftSideBar from '../components/LeftSideBar';
import DroppableArea from '../components/DroppableArea';

function TestCase() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex' }}>
        <LeftSideBar />
        <DroppableArea />
      </Box>
    </DndProvider>
  );
}

export default TestCase;
