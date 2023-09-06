import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Typography, AppBar, Toolbar, Button } from '@mui/material';

import LeftSideBar from '../components/LeftSideBar';
import DroppableArea from '../components/DroppableArea';
import { fetchName } from '../api';

function TestCase() {
  const { id, testCaseId } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back
  };

  const navigateToTutorial = () => {
    navigate('/tutorial1'); // Navigate to the tutorial page
  };
  const navigateToTutorial2 = () => {
    navigate('/tutorial2'); // Navigate to the tutorial page
  };
 const navigateToTutorial3 = () => {
    navigate('/tutorial3'); // Navigate to the tutorial page
  };
  const navigateToTutorial4 = () => {
    navigate('/tutorial4'); // Navigate to the tutorial page
  };
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
  }, [testCaseId, setName]);

  return (
    <DndProvider backend={HTML5Backend}>
      <AppBar position="static">
        <Toolbar>
          {testCaseId && (
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Name: {name}
            </Typography>
          )}
          <Button color="inherit" onClick={handleGoBack}>
            Go Back
          </Button>
          <Button color="inherit" onClick={navigateToTutorial}>
            Locator Selection
          </Button>
          <Button color="inherit" onClick={navigateToTutorial2}>
            User Behavior Guide
          </Button>
          <Button color="inherit" onClick={navigateToTutorial3}>
          HTML Basics
          </Button>
          <Button color="inherit" onClick={navigateToTutorial4}>
          Platform Introduction
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', maxHeight: '90vh' }}>
        <LeftSideBar />
        <DroppableArea id={id} testCaseId={testCaseId} />
      </Box>
    </DndProvider>
  );
}

export default TestCase;
