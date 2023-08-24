import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { Box } from "@material-ui/core";
import { getItemColor } from "../utils";

const DraggableItem = ({ type, subType, color, children, InputComponent, onDragBegin, parentId, params }) => {
  const [dragParams, setDragParams] = useState(params);
  const dragParamsRef = useRef(dragParams);  // 使用 useRef 来存储 dragParams 的值

  useEffect(() => {
    dragParamsRef.current = dragParams;  // 更新 useRef 的当前值
  }, [dragParams]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: () => {
      return {
        type,
        subType,
        params: dragParamsRef.current, // 使用 useRef 的当前值
        parentId,
        isNew: true,
        selectorValue: dragParamsRef.current.reduce((acc, cur) => cur.type || "", ""),
      };
    },
    canDrag: () => {
      if (InputComponent && dragParams.some(param => param.value.trim() === "")) {
        window.alert("Please fill in the input before dragging!");
        return false;
      }
      return true;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log("item——end:", item);
      if (monitor.didDrop()) {
        setDragParams(dragParams.map(p => ({ value: "", type: "" })));
      }
    },
  }));

  const handleInputChange = (index, event) => {
    const newDragParams = [...dragParams];
    console.log("event.target",event.target.value)
    newDragParams[index].value = event.target.value;
    setDragParams(newDragParams);
  };
  const handleSeInputChange = (index, event) => {
    const newDragParams = [...dragParams];
    console.log("event.target",event.target.value)
    newDragParams[index].textValue = event.target.value;
    setDragParams(newDragParams);
  };
  const handleSelectorChange = (index, event) => {
    const newDragParams = [...dragParams];
    newDragParams[index].type = event.target.value;
    setDragParams(newDragParams);
  };

  const InputComponents = () => (
    dragParams.map((param, idx) => {
      console.log("param at index", idx, ":", param);  // 打印每个param的内容
      return (
        <InputComponent
          key={idx}
          onChange={(e) => handleInputChange(idx, e)}
          onSeChange={(e) => handleSeInputChange(idx, e)}
          value={param.value}
          textValue={param.textValue}
          onSelectorChange={(e) => handleSelectorChange(idx, e)}
          selectorValue={param.type}
        />
      );
    })
  );
  

  return (
    <Box
      ref={drag}
      style={{
        padding: 8,
        margin: 8,
        borderRadius: 4,
        backgroundColor: getItemColor(type),
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {children}
      {subType && (
        <Box style={{ marginTop: 8 }}>
          <p>{subType}</p>
        </Box>
      )}
      {/* {params} */}
      {InputComponent && <InputComponents />}
    </Box>
  );
};

export default DraggableItem;
