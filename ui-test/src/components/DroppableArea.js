import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Box } from "@mui/material";
import DroppableItem from "./DroppableItem";

const DroppableArea = () => {
  const [droppedItems, setDroppedItems] = useState([]);

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
        { type: item.type, inputValue: item.inputValue },
      ],
    };
    return newItems;
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["Given", "When", "Then"],
    drop: (item, monitor) => {
      if (item.type === "Given") {
        setDroppedItems((items) => [
          ...items,
          {
            id: Date.now(),
            type: item.type,
            children: [],
            inputValue: item.inputValue,
          },
        ]);
      } else {
        const parentId=monitor.getDropResult().parentId
        setDroppedItems((items) => handleDrop(item, parentId, items));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [, dropDroppableItem] = useDrop(() => ({
    accept: "DROPPABLE_ITEM",
    drop: (item, monitor) => {
      const sourceIndex = item.index;
      const dropResult = monitor.getDropResult();
      console.log("dropResult", dropResult);
      const targetIndex = dropResult ? dropResult.targetIndex : droppedItems.length;
      const newItems = [...droppedItems];
  
      if (sourceIndex !== targetIndex) {
        newItems.splice(sourceIndex, 1);
        newItems.splice(targetIndex, 0, item);
        setDroppedItems(newItems);
      }
      console.log("droppedItems", droppedItems);
    },
  }));

  return (
    <Box
      ref={(node) => {
        drop(node);
        dropDroppableItem(node);
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
  >
    {(item.children || []).map((child, idx) => (
      <DroppableItem
        key={idx}
        type={child.type}
        inputValue={child.inputValue}
        index={idx}
        parentId={item.id} // 将 item.id 作为 parentId 传递
      />
    ))}
  </DroppableItem>
))}

    </Box>
  );
};

export default DroppableArea;
