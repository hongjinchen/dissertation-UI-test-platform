import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import DroppableItem from "./DroppableItem";
import { saveTestCase, runTestEvent, fetchTestCaseData } from "../api";


const DroppableArea = ({ id, testCaseId }) => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [environments, setEnvironments] = useState({
    chrome: false,
    edge: false,
    safari: false,
    firefox: false,
  });
  
  const [label, setLabel] = useState("");
  const [testCaseName, setTestCaseName] = useState("");

  const navigate = useNavigate();
  const [droppedItems, setDroppedItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Updated droppedItems:", droppedItems);
  }, [droppedItems]);

  useEffect(() => {
    async function getName() {
      const fetchedData = await fetchTestCaseData(testCaseId);
      console.log("fetchedData",fetchedData)
      if (testCaseId) {
        setDroppedItems(fetchedData);
        console.log("fetchedData:", fetchedData);
      }
    }
    if (testCaseId) {
      getName();
    }
    console.log('testCaseId:', testCaseId);
  }, [testCaseId]);

  const submitTestCase = async (data) => {
    const response = await saveTestCase(data);
    console.log(response);
  };

  const handleRunClick = () => {
    setOpenDialog(true);
  };
  const handleSave = () => {
    if (testCaseName === '' || !Object.values(environments).some(val => val)) {
      setError("Please fill out all required fields");
      alert("Please fill out all required fields");
      return;
    }
    const selectedEnvironments = Object.keys(environments).filter((key) => environments[key]);
    setEnvironments({ chrome: false, edge: false, safari: false, firefox: false });
    setLabel("");
    const currentDate = new Date();
    const isoString = currentDate.toISOString();

    const test_cases = droppedItems.map((item, index) => {
      return {
        created_at: isoString,
        type: item.type,
        subtype: item.subtype,
        parameters: item.params,
        test_case_elements: [
          ...(item.children?.map((child) => ({
              type: child.type,
              subtype: child.subType,
              parameters: child.params,
          })) || []),
      ],
      };
    });

    const data = {
      test_event: {
        name: testCaseName,
        created_at: isoString,
        created_by: Cookies.get('userId'),
        environment: selectedEnvironments,
        label: label,
        team_id: id
      },
      test_cases: test_cases
    }
    submitTestCase(data);
    setOpenDialog(false);
  };

  const handleRun = async () => {
    if (testCaseName === '' || !Object.values(environments).some(val => val)) {
      setError("Please fill out all required fields");
      alert("Please fill out all required fields");
      return;
    }
    setLoading(true);

    const selectedEnvironments = Object.keys(environments).filter((key) => environments[key]);
    const currentDate = new Date();
    const isoString = currentDate.toISOString();

    const test_cases = droppedItems.map((item, index) => {
      return {
        created_at: isoString,
        type: item.type,
        subtype: item.subtype,
        parameters: item.params,
        test_case_elements: [
          ...item.children.map((child) => ({
            type: child.type,
            subtype: child.subType,
            parameters: child.params,
          })),
        ],
      };
    });

    const data = {
      test_event: {
        name: testCaseName,
        created_at: isoString,
        created_by: Cookies.get('userId'),
        environment: selectedEnvironments,
        label: label,
        team_id: id
      },
      test_cases: test_cases
    };

    const result = await runTestEvent(data);

    setLoading(false);
    console.log("result.status:", result);
    if (result.status === 'completed') {
      console.log("Navigating to testReport page");
      // 如果测试已完成（不论成功与否），都将导航到报告页面
      navigate('/testReport/' + result.report_id);
      setOpenDialog(false);
    } else {
      // 如果由于某种原因测试未完成（例如异常），将在控制台打印一个错误消息
      console.error("Test not successfully completed: ", result.message);
      alert(result.message);
    }
  };

  const handleDrop = (item, parentId, items) => {
    if (!parentId) return items;
    const givenIndex = items.findIndex(
      (it) => it.type === "Given" && it.id === parentId
    );
    if (givenIndex === -1) return items;

    const newItems = [...items];
    newItems[givenIndex] = {
      ...newItems[givenIndex],
      children: [
        ...newItems[givenIndex].children,
        {
          type: item.type,
          subType: item.subType,
          params: item.params,
          isNew: false,
          isChild: true,
          parentId: parentId,
          index: newItems[givenIndex].children.length,
        },
      ],
    };
    return newItems;
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["Given", "When", "Then"],
    drop: (item, monitor) => {
      console.log("item:", item);
      if (item.isNew) {
        const parentId = monitor.getDropResult()?.parentId;
        if (item.type === "Given") {
          setDroppedItems((items) => [
            ...items,
            {
              id: Date.now(),
              type: item.type,
              subtype: item.subType,
              children: [],
              params: item.params,
              isNew: false,
              isChild: item.isChild || false,
              index: droppedItems.length,
              selectorValue: item.selectorValue,
            },
          ]);
          console.log("item.subType:", item.subType);
        } else {
          setDroppedItems((items) => handleDrop(item, parentId, items));
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  // 删除功能
  const [{ isOverTrash }, trashDrop] = useDrop(() => ({
    accept: ["Given", "When", "Then"],
    drop: (item, monitor) => {
      console.log(item)
      if (!item.isNew) {
        if (item.isChild) {
          setDroppedItems((items) =>
            items.map((i) => {
              if (i.id === item.parentId) {
                return {
                  ...i,
                  children: i.children.filter((_, idx) => idx !== item.index),
                };
              }
              return i;
            })
          );
        } else {
          setDroppedItems((items) => items.filter((_, idx) => idx !== item.index));
        }
      }
    },
    collect: (monitor) => ({
      isOverTrash: monitor.isOver({ shallow: true }),
    }),
  }));


  return (
    <Box
      ref={(node) => {
        drop(node);
      }}
      sx={{
        flexGrow: 1,
        backgroundColor: isOver ? "lightblue" : "white",
        padding: 2,
        position: "relative",
      }}
    >
      {droppedItems.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <DroppableItem
            id={item.id}
            type={item.type}
            subtype={item.subtype}
            params={item.params} 
            index={index}
            parentId={item.id}
            isNew={item.isNew}
            droppedItems={droppedItems}
            setDroppedItems={setDroppedItems}
          />
          {item.children && (
            <div>
              {item.children.map((child, idx) => (
                <DroppableItem
                  key={idx}
                  type={child.type}
                  subtype={child.subType}
                  params={child.params}
                  index={idx}
                  parentId={item.id}
                  isChild
                  selectorValue={child.selectorValue}
                  droppedItems={droppedItems}
                  setDroppedItems={setDroppedItems}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", bottom: 50, right: 100 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleRunClick}
        >
          Run OR Save
        </Button>
      </div>
      <Box
        ref={trashDrop}
        sx={{
          position: "absolute",
          top: 30,
          right: 30,
          width: 60,
          height: 60,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isOverTrash ? "#6C94C6" : "transparent",
          borderRadius: "50%",
          border: '4px solid gray',
        }}
      >
        <DeleteIcon sx={{ color: isOverTrash ? 'white' : 'gray', fontSize: 30 }} />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Run Test</DialogTitle>
        <DialogContent>
          <div>
            <h4>Test Case Name:</h4>
            <TextField
              required
              fullWidth
              placeholder="Enter a test case name"
              value={testCaseName}
              onInput={(e) => setTestCaseName(e.target.value)}
            />
            <h4>Select Environment:</h4>
            <FormControlLabel
              control={
                <Checkbox
                  checked={environments.chrome}
                  onChange={(e) =>
                    setEnvironments({ ...environments, chrome: e.target.checked })
                  }
                />
              }
              label="Google Chrome"
              name="environment"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={environments.edge}
                  onChange={(e) =>
                    setEnvironments({ ...environments, edge: e.target.checked })
                  }
                />
              }
              label="Microsoft Edge"
              name="environment"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={environments.safari}
                  onChange={(e) =>
                    setEnvironments({ ...environments, safari: e.target.checked })
                  }
                />
              }
              label="Safari"
              name="environment"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={environments.firefox}
                  onChange={(e) =>
                    setEnvironments({ ...environments, firefox: e.target.checked })
                  }
                />
              }
              label="Mozilla Firefox"
              name="environment"
            />
          </div>
          <div>
            <h4>Label (Optional):</h4>
            <TextField fullWidth placeholder="Enter a label"
              value={label}
              onInput={(e) => setLabel(e.target.value)} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Back</Button>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleRun}>Run</Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}

    </Box>
  );
};

export default DroppableArea;
