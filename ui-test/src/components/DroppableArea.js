import React, { useState,useEffect  } from "react";
import { useDrop } from "react-dnd";
import { Box } from "@mui/material";
import DroppableItem from "./DroppableItem";

const DroppableArea = () => {
  const [droppedItems, setDroppedItems] = useState([]);
  useEffect(() => {
    console.log("Updated droppedItems:", droppedItems);
  }, [droppedItems]);
  
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
        { type: item.type, inputValue: item.inputValue, isNew: false }, // 设置 isNew 为 true
      ],
    };
    return newItems;
  };
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["Given", "When", "Then", "DROPPABLE_ITEM"],
    drop: (item, monitor) => {
      if (item.type === "Given" || item.type === "When" || item.type === "Then") {
        const parentId = monitor.getDropResult()?.parentId;
        if (item.type === "Given") {
          if (item.isNew) {
            setDroppedItems((items) => [
              ...items,
              {
                id: Date.now(),
                type: item.type,
                children: [],
                inputValue: item.inputValue,
                isNew: false, // 添加 isNew 属性
              },
            ]);
          }
        } else {
          if (item.isNew) {
            setDroppedItems((items) => handleDrop(item, parentId, items));
          }
        }
      } else {
        if (item.isNew) {
          const sourceIndex = item.index;
          const dropResult = monitor.getDropResult();
          const targetIndex = dropResult
            ? dropResult.targetIndex
            : droppedItems.length;
          const newItems = [...droppedItems];
    
          if (sourceIndex !== targetIndex) {
            const draggedItem = {
              id: Date.now(),
              type: item.type,
              children: [],
              inputValue: item.inputValue,
            };
            newItems.splice(sourceIndex, 1);
            newItems.splice(targetIndex, 0, draggedItem);
            setDroppedItems(newItems);
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={(node) => {
        drop(node);
      }}
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: isOver ? "lightblue" : "white",
        padding: 2,
      }}
    >
{droppedItems.map((item, index) => (
  <DroppableItem
    key={index}
    type={item.type}
    inputValue={item.inputValue}
    index={index}
    parentId={item.id} // 将 item.id 作为 parentId 传递
    isNew={item.isNew} // 传递 isNew 属性
  >
    {(item.children || []).map((child, idx) => (
      <DroppableItem
        key={idx}
        type={child.type}
        inputValue={child.inputValue}
        index={idx}
        parentId={item.id} // 将 item.id 作为 parentId 传递
        isNew={child.isNew} // 传递 isNew 属性给子项目
      />
    ))}
  </DroppableItem>
))}
    </Box>
  );
};

export default DroppableArea;
