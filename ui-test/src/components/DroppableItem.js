import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@mui/material";
import { darken } from "@mui/system";


const DroppableItem = ({
  type,
  id,
  inputValue,
  children,
  index,
  parentId,
  isNew,
  setDroppedItems,
  droppedItems,
}) => {
  const rearrangeItems = (sourceIndex, targetIndex) => {
    console.log("!!!!!!")
    const newItems = [...droppedItems];
  
    const sourceParentId = newItems[sourceIndex].parentId;
    const targetParentId = newItems[targetIndex].parentId;
  
    // 如果 source 和 target 的 parentId 相同，则在同一父元素下移动
    if (sourceParentId === targetParentId) {
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, removed);
    } else {
      // 如果 source 和 target 的 parentId 不同，则在不同的父元素之间移动
      const sourceParentIndex = newItems.findIndex((item) => item.id === sourceParentId);
      const targetParentIndex = newItems.findIndex((item) => item.id === targetParentId);
  
      const [removed] = newItems[sourceParentIndex].children.splice(index, 1);
      newItems[targetParentIndex].children.splice(index, 0, removed);
    }
    
    setDroppedItems(newItems);
  };
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: {
      type,
      inputValue,
      index,
      isNew: isNew || false,
      isChild: type !== "Given",
      ...(type === "Given"
        ? { id } // 当 type 为 "Given" 时，包含 id
        : { parentId }), // 当 type 不为 "Given" 时，包含 parentId
    },
    collect: (monitor) => {
      const isDragging = monitor.isDragging();
      return { isDragging };
    },
  }));
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["When", "Then", "Given"],
    drop: (item, monitor) => {
      // console.log(monitor)
      if (type === "Given") {
        return {
          parentId: parentId,
          targetIndex: index, // 添加 targetIndex
        };
      }
      
      if (!item.isNew) {
        const sourceIndex = item.index;
        const targetIndex = index;
        rearrangeItems(sourceIndex, targetIndex);
        if (item.isChild) {
          return {
            parentId: parentId || item.parentId,
            targetIndex: index + 1,
          };
        }
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
