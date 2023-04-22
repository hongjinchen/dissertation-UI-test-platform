import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@mui/material";
import { darken } from "@mui/system";


const DroppableItem = ({
  type,
  inputValue,
  children,
  index,
  parentId,
  isNew,
  setDroppedItems,
  droppedItems,
}) => {
  const rearrangeItems = (sourceIndex, targetIndex) => {
    const newItems = [...droppedItems];
    const [removed] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, removed);
    setDroppedItems(newItems);
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
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
      return { isDragging };
    },
  }));
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["When", "Then", "Given"],
    drop: (item, monitor) => {
      if (type === "Given") {
        return {
          parentId: parentId,
          targetIndex: index, // 添加 targetIndex
        };
      }
      
      if (!item.isNew) {
        console.log("item!!!", monitor);
        if (item.isChild) {
          return {
            parentId: parentId || item.parentId,
            targetIndex: index + 1,
          };
        }
        console.log("item!!!", item);
        // 如果不是新建的元素，调用 rearrangeItems 函数
        const sourceIndex = item.index;
        const targetIndex = index;
        rearrangeItems(sourceIndex, targetIndex);
      }
      
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));
  const getItemColor = (isOver) => {
    let color;
    switch (type) {
      case "Given":
        color = "#DCA690";
        break;
      case "When":
        color = "#AE99A2";
        break;
      case "Then":
        color = "#967B99";
        break;
      default:
        color = "#BBBED0";
    }
    
    return isOver ? darken(color, 0.1) : color; // 如果 isOver 为 true，颜色变深
  };

  return (
    <Box
      ref={(node) => drag(drop(node))}
      sx={{
        backgroundColor: getItemColor(isOver),
        borderRadius: 1,
        padding: 1,
        margin: 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        boxShadow: isOver ? "0 0 10px rgba(0, 0, 0, 0.5)" : "none", // 根据 isOver 改变阴影效果
      }}
    >
      {type}: {inputValue}
      <Box sx={{ paddingLeft: 2 }}>{children}</Box>
    </Box>
  );
};

export default DroppableItem;
