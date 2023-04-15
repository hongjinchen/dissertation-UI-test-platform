import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Box } from '@mui/material';
import DroppableItem from './DroppableItem';

const DroppableArea = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['Given', 'When', 'Then'],
    drop: (item) => {
      // console.log("input value", item.inputValue); // 在此处打印输入值以进行调试
      if (item.type === 'Given') {
        setDroppedItems((items) => [
          ...items,
          { id: Date.now(), type: item.type, children: [], inputValue: item.inputValue },
        ]);
      } else {
        setDroppedItems((items) => {
          
          const givenIndex = items.findIndex((it) => it.type === 'Given' && it.id === item.parentId);
          console.log("Child", givenIndex); // 在此处打印输入值以进行调试
          if (givenIndex === -1) return items;
  
          const newItems = [...items];
          newItems[givenIndex] = {
            ...newItems[givenIndex],
            children: [
              ...newItems[givenIndex].children,
              { type: item.type, inputValue: item.inputValue },
            ],
          };
          console.log("Child", newItems[givenIndex].children); // 在此处打印输入值以进行调试
          return newItems;
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const [, dropDroppableItem] = useDrop(() => ({
    accept: 'DROPPABLE_ITEM',
    drop: (item, monitor) => {
      const targetIndex = droppedItems.length;
      const sourceIndex = item.index;
      const newItems = [...droppedItems];

      newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, item);

      setDroppedItems(newItems);
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
        minHeight: '100vh',
        backgroundColor: isOver ? 'lightblue' : 'white',
        padding: 2,
      }}
    >
      {droppedItems.map((item) => (
        <React.Fragment key={item.id}>
          <DroppableItem
            type={item.type}
            inputValue={item.inputValue}
            index={item.index}
            parentId={item.parentId}
          />
          {item.children.map((child) => (
            <DroppableItem
              key={child.id}
              type={child.type}
              inputValue={child.inputValue}
              index={child.index}
              parentId={item.id}
            />
          ))}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default DroppableArea;
