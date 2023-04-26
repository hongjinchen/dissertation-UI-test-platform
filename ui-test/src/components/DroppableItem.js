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
  // react-dnd
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
      // if (isDragging) {
      //   console.log('Dragging item:', monitor.getItem());
      // }
      return { isDragging };
    },
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ["When", "Then", "Given"],
    drop: (item, monitor) => {
      if (type === "Given" && item.isNew) {
        return {
          parentId: parentId,
          targetIndex: index,
        };
      }

      // if ((item.type === "When" || item.type === "Then") && !item.isNew) {
      //   console.log("item", item);
      //   console.log("droppedItems",droppedItems)
      //   const dragIndex = item.index;
      //   const hoverIndex = index;
      //   if (dragIndex === hoverIndex) return;

      //   moveItem(dragIndex, hoverIndex);
      // }
      
      if (item.isChild) {
        return {
          parentId: parentId || item.parentId,
          targetIndex: index + 1,
        };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = droppedItems[dragIndex];
    const newDroppedItems = [...droppedItems];
    newDroppedItems.splice(dragIndex, 1);
    newDroppedItems.splice(hoverIndex, 0, draggedItem);
    setDroppedItems(newDroppedItems);
  };

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
