import React, { useState, useRef } from "react";
import { useDrag } from "react-dnd";
import { Box } from "@material-ui/core";
import { getItemColor } from "../utils"; // Import the getItemColor function

const DraggableItem = ({ type, subType, color, children, InputComponent, onDragBegin, parentId }) => {
  const [inputState, setInputState] = useState({ inputValue: "", selectorValue: "" });
  const inputValueRef = useRef(inputState.inputValue); // 使用 useRef 存储输入值

  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: () => {
      return { 
        type, 
        subType, 
        inputValue: inputValueRef.current, 
        parentId, 
        isNew: true,
        selectorValue: inputState.selectorValue  // Add this line
      };
    },
    canDrag: () => {
      // 如果需要输入组件，且输入值为空，则不允许拖拽，并弹出警告
      if (InputComponent && inputValueRef.current.trim() === "") {
        window.alert("Please fill in the input before dragging!");
        return false;
      }
      // 否则，允许拖拽
      return true;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        console.log(item.selectorValue);  // Print the selected value
        setInputState({ inputValue: "", selectorValue: "" });
        inputValueRef.current = "";
      }
    },
    
  }));

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    setInputState(prevState => ({ ...prevState, inputValue: newInputValue }));
    inputValueRef.current = newInputValue;
  };

  const handleSelectorChange = (event) => {
    setInputState(prevState => ({ ...prevState, selectorValue: event.target.value }));
  };

  const InputWrapper = () => (
    <InputComponent
      onChange={handleInputChange}
      value={inputState.inputValue}
      onSelectorChange={handleSelectorChange}
      selectorValue={inputState.selectorValue}
    />
  );
  return (
    <Box
      ref={drag}
      style={{
        padding: 8,  // 1em is usually 16px, adjust as needed
        margin: 8,  // adjust as needed
        borderRadius: 4,  // adjust as needed
        backgroundColor: getItemColor(type),
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {children}
      {subType && ( // Render subType if it exists
        <Box style={{ marginTop: 8 }}>
          <p>{subType}</p>
        </Box>
      )}
      {InputComponent && (
        <Box style={{ marginTop: 8 }}>
          <InputWrapper />
        </Box>
      )}
    </Box>
  );
};

export default DraggableItem;
