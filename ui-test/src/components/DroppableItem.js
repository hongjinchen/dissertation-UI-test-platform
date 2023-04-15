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
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "DROPPABLE_ITEM",
    item: { type, inputValue, index, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["When", "Then"],
    drop: (item, monitor) => {
      if (type === "Given") {
        console.log("targetIndex", index);
        return {
          parentId: parentId,
          targetIndex: index, // 添加 targetIndex
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
