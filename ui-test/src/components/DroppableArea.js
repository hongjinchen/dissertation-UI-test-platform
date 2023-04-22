import React, { useState, useEffect } from "react";
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
        {
          type: item.type,
          inputValue: item.inputValue,
          isNew: false,
          isChild: true,
          parentId: parentId, // 添加 parentId 属性
          index: newItems[givenIndex].children.length,
        }, // 设置 isNew 为 true
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
        <div key={index} style={{ display: "flex" }}>
          <DroppableItem
            type={item.type}
            inputValue={item.inputValue}
            index={index}
            parentId={item.id}
            isNew={item.isNew}
            droppedItems={droppedItems} // 添加这行
            setDroppedItems={setDroppedItems} // 添加这行
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
                  droppedItems={droppedItems} // 添加这行
                  setDroppedItems={setDroppedItems} // 添加这行
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </Box>
  );
};

export default DroppableArea;
