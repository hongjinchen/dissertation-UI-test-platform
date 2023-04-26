import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import DroppableItem from "./DroppableItem";
import { saveTestCase } from "../api"
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const navigate = useNavigate();
  const [droppedItems, setDroppedItems] = useState([]);
  useEffect(() => {
    console.log("Updated droppedItems:", droppedItems);
  }, [droppedItems]);
  const submitTestCase = async (data) => {
    const response = await saveTestCase(data);
    console.log(response);
  };
  // 提交内容时的逻辑
  const handleRunClick = () => {
    const selectedEnvironments = Object.keys(environments).filter((key) => environments[key]);
    setEnvironments({ chrome: false, edge: false, safari: false, firefox: false });
    setLabel("");
    setOpenDialog(true);
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    const data = {
      test_event: {
        name: "Test Event 1",
        created_at: isoString,
        created_by: 1,
        environment: selectedEnvironments,
        label: label,
        team_id: id
      },
      test_cases: [
        {
          name: "Test Case 1",
          created_at: "2023-04-26T12:30:00.000Z",
          type: "Type A",
          parameters: "Parameter 1",
          test_case_elements: [
            {
              story_id: 1,
              type: "Given",
              parameters: "Parameter 1"
            },
            {
              story_id: 1,
              type: "When",
              parameters: "Parameter 2"
            }
          ]
        },
        {
          name: "Test Case 2",
          created_at: "2023-04-26T12:30:00.000Z",
          type: "Type B",
          parameters: "Parameter 2",
          test_case_elements: [
            {
              story_id: 2,
              type: "Given",
              parameters: "Parameter 3"
            },
            {
              story_id: 2,
              type: "Then",
              parameters: "Parameter 4"
            }
          ]
        }
      ]
    }
    submitTestCase(data);
  };
  const handleSave = () => {
    console.log("Environments:", environments);
    console.log("Label:", label);
    setOpenDialog(false);
  };

  const handleRun = () => {
    console.log("Environments:", environments);
    console.log("Label:", label);
    setLoading(true);
    // 在这里，可以将用户的选择和输入值发送给后端或执行其他操作
    const reportId = 1;
    setTimeout(() => {
      setLoading(false);
      navigate('/testReport/' + reportId);
    }, 3000);
    setOpenDialog(false);
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
          inputValue: item.inputValue,
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
      if (item.isNew) {
        const parentId = monitor.getDropResult()?.parentId;
        if (item.type === "Given") {
          setDroppedItems((items) => [
            ...items,
            {
              id: Date.now(),
              type: item.type,
              children: [],
              inputValue: item.inputValue,
              isNew: false,
              isChild: item.isChild || false,
              index: droppedItems.length, // 添加 childIndex 属性
            },
          ]);
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
          console.log("????")
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
            inputValue={item.inputValue}
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
                  inputValue={child.inputValue}
                  index={idx}
                  parentId={item.id}
                  isChild
                  droppedItems={droppedItems}
                  setDroppedItems={setDroppedItems}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleRunClick}
          sx={{
            position: "absolute",
            bottom: 50,
            right: 100,
          }}
        >
          Run OR Save
        </Button>
      </div>
      <Box

        ref={trashDrop}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 40,
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isOverTrash ? "red" : "transparent",
          borderRadius: "50%",
        }}
      >
        <DeleteIcon />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Run Test</DialogTitle>
        <DialogContent>
          <div>
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
