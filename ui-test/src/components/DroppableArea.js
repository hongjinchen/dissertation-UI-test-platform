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
      const dropResult = monitor.getDropResult();
      const targetIndex = dropResult
        ? dropResult.targetIndex
        : droppedItems.length;

      console.log("item", item);
      // Handle reordering of child items
      if (item.isChild) {
        console.log("item!!!!!!!!!!!!!!!!!", item);
        setDroppedItems((items) => {
          // Find source parent
          const sourceParentIndex = items.findIndex(
            (it) => it.id === item.parentId
          );
          const sourceParent = items[sourceParentIndex];

          // Remove the child from the source parent
          const sourceChildren = [...sourceParent.children];
          const draggedChild = sourceChildren[item.index];
          sourceChildren.splice(item.index, 1);

          // Find target parent
          console.log("dropResult", dropResult);
          const targetParentIndex = items.findIndex(
            (it) => it.id === dropResult.parentId
          );
          const targetParent = items[targetParentIndex];

          // If the target parent is the same as the source parent, use the same parent
          const finalParent = targetParent || sourceParent;
          const finalParentIndex =
            targetParentIndex !== -1 ? targetParentIndex : sourceParentIndex;

          // Add the child to the target parent
          const targetChildren = [...finalParent.children];
          targetChildren.splice(targetIndex, 0, draggedChild);

          // Update the items
          const newItems = [...items];
          newItems[finalParentIndex] = {
            ...finalParent,
            children: targetChildren,
          };

          return newItems;
        });
      } else {
        if (
          item.type === "Given" ||
          item.type === "When" ||
          item.type === "Then"
        ) {
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
                  isNew: false,
                  isChild: item.isChild || false,
                  index: droppedItems.length, // 添加 childIndex 属性
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
                isChild: item.isChild || false,
              };
              newItems.splice(sourceIndex, 1);
              newItems.splice(targetIndex, 0, draggedItem);
              setDroppedItems(newItems);
            }
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
        // <DroppableItem
        //   key={index}
        //   type={item.type}
        //   inputValue={item.inputValue}
        //   index={index}
        //   parentId={item.id} // 将 item.id 作为 parentId 传递
        //   isNew={item.isNew} // 传递 isNew 属性
        // >
        //   {(item.children || []).map((child, idx) => (
        //     <DroppableItem
        //       key={idx}
        //       type={child.type}
        //       inputValue={child.inputValue}
        //       index={idx}
        //       parentId={item.id} // 将 item.id 作为 parentId 传递
        //       isChild // 添加 isChild 属性
        //     />
        //   ))}
        // </DroppableItem>
        <DroppableItem
          key={index}
          type={item.type}
          inputValue={item.inputValue}
          index={index}
          parentId={item.id}
          isNew={item.isNew}
        >
          {item.children &&
            item.children.map((child, idx) => (
              <DroppableItem
                key={idx}
                type={child.type}
                inputValue={child.inputValue}
                index={idx}
                parentId={item.id}
                isChild
              />
            ))}
        </DroppableItem>
      ))}
    </Box>
  );
};

export default DroppableArea;
