import React, { useState, useRef } from "react";
import { useDrag } from "react-dnd";
import { Box, TextField } from "@mui/material";

const DraggableItem = ({ type, color, children, InputComponent,onDragBegin,parentId }) => {
  const [inputValue, setInputValue] = useState("");
  const inputValueRef = useRef(inputValue); // 使用 useRef 存储输入值

  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: () => {
      // console.log('inputValueRef.current:', inputValueRef.current);
      return { type, inputValue: inputValueRef.current,parentId  };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    inputValueRef.current = event.target.value;
    console.log("input value", inputValueRef);
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
        cursor: "grab",
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
