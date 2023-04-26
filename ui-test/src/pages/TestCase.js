import React from 'react';
import { useParams } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box } from '@mui/material';
import LeftSideBar from '../components/LeftSideBar';
import DroppableArea from '../components/DroppableArea';

function TestCase() {
  const {id, testCaseId}=useParams();
  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex' , maxHeight: "90vh" }}>
        <LeftSideBar />
        <DroppableArea id={id} testCaseId={testCaseId}/>
      </Box>
    </DndProvider>
  );
}

export default TestCase;
