import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@mui/material";

const DroppableItem = ({
  type,
  inputValue,
  children,
  index,
  onDelete,
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
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["When", "Then","Given"],
    drop: (item, monitor) => {
      console.log("item", item)
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

  return (
    <Box
      ref={(node) => drag(drop(node))}
      sx={{
        backgroundColor: type === "Given" ? "orange" : "transparent",
        borderRadius: 1,
        padding: 1,
        margin: 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {type}: {inputValue}
      {children}
    </Box>
  );
};

export default DroppableItem;
