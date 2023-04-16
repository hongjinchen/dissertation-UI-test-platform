import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@mui/material";
const DroppableItem = ({
  type,
  inputValue,
  children,
  index,
  parentId,
  isNew
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "DROPPABLE_ITEM",
    item: {
      type,
      inputValue,
      index,
      parentId,
      isNew: isNew || false,
      isChild: parentId ? true : false, // Add the new isChild property
    },
    collect: (monitor) => {
      const isDragging = monitor.isDragging();
      if (isDragging) {
        console.log("正在拖拽的组件信息:", {
          type,
          inputValue,
          index,
          parentId,
          isNew: isNew || false,
          isChild: parentId ? true : false,
        });
      }
      return { isDragging };
    },
  }));
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["When", "Then","Given"],
    drop: (item, monitor) => {
      console.log("目标子组件信息:", { type, inputValue, index, parentId, isNew });
      if (type === "Given") {
        return {
          parentId: parentId,
          targetIndex: index, // 添加 targetIndex
        };
      }
      console.log("item", item)
      if (item.isChild) {
        console.log("item.parentId", item.parentId)
        return {
          parentId: parentId|| item.parentId,  // 如果 parentId 不存在，则使用 item.parentId
          targetIndex: children.length, // Return the new target index
        };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  const getItemColor = () => {
    switch (type) {
      case "Given":
        return "#DCA690";
      case "When":
        return "#AE99A2";
      case "Then":
        return "#967B99";
      default:
        return "#BBBED0";
    }
  };

  return (
    <Box
      ref={(node) => drag(drop(node))}
      sx={{
        backgroundColor: getItemColor(inputValue),
        borderRadius: 1,
        padding: 1,
        margin: 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        boxShadow: isDragging ? "0 0 10px rgba(0, 0, 0, 0.5)" : "none", // Add this line for shadow effect
      }}
    >
      {type}: {inputValue}
      <Box sx={{ paddingLeft: 2 }}>{children}</Box>
    </Box>
  );

};

export default DroppableItem;
