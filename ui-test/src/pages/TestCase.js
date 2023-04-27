import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Typography, AppBar, Toolbar } from '@mui/material';

import LeftSideBar from '../components/LeftSideBar';
import DroppableArea from '../components/DroppableArea';
import { fetchName } from '../api';


function TestCase() {
  const { id, testCaseId } = useParams();
  const [name, setName] = useState('');
  console.log(id, testCaseId);
  useEffect(() => {
    async function getName() {
      const fetchedName = await fetchName(testCaseId);
      if (fetchedName) {
        setName(fetchedName);
      }
    }
    if (testCaseId) {
      getName();
    }
    console.log('testCaseId:', testCaseId);
  }, [testCaseId, setName]);

  return (
    <DndProvider backend={HTML5Backend}>
      {testCaseId && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Name: {name}
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <Box sx={{ display: 'flex', maxHeight: '90vh' }}>
        <LeftSideBar />
        <DroppableArea id={id} testCaseId={testCaseId} />
      </Box>
    </DndProvider>
  );
}

export default TestCase;
