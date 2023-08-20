import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box } from "@mui/material";
import { darken } from "@mui/system";


const DroppableItem = ({
  type,
  subtype,
  id,
  params,
  children,
  index,
  parentId,
  isNew,
  selectorValue,
  setDroppedItems,
  droppedItems,
}) => {
  // react-dnd
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: {
      type,
      params,
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
      if (type === "Given" && item.isNew) {
        return {
          parentId: parentId,
          targetIndex: index,
        };
      }

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

  // const moveItem = (dragIndex, hoverIndex) => {
  //   const draggedItem = droppedItems[dragIndex];
  //   const newDroppedItems = [...droppedItems];
  //   newDroppedItems.splice(dragIndex, 1);
  //   newDroppedItems.splice(hoverIndex, 0, draggedItem);
  //   setDroppedItems(newDroppedItems);
  // };

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
      {type}
      <Box
        sx={{
          fontSize: '16px',
          padding: '2px',
          margin: '5px 0',
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            borderRadius: '5px',
            marginBottom: '1rem'
          }}
        >
           {subtype}
        </Box>
        <Box
          sx={{
            border: '1px solid blue',
            borderRadius: '5px'
          }}
        >
           {/* 显示params的值 */}
           {params.map((param, idx) => (
             <div key={idx}>
               {param.type}: {param.value}
             </div>
           ))}
        </Box>
      </Box>
      <Box sx={{ paddingLeft: 2 }}>{children}</Box>
    </Box>
  );
};

export default DroppableItem;
