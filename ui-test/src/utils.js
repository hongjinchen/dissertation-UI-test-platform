export const findNestedIndex = (items, parentId) => {
  return items.findIndex((item) => item.id === parentId);
};

export const moveNestedItem = (
  items,
  sourceParentId,
  sourceIndex,
  targetParentId,
  targetIndex
) => {
  const newItems = [...items];
  const sourceParentIdx = findNestedIndex(newItems, sourceParentId);
  const targetParentIdx = findNestedIndex(newItems, targetParentId);

  const [removed] = newItems[sourceParentIdx].children.splice(sourceIndex, 1);
  newItems[targetParentIdx].children.splice(targetIndex, 0, removed);

  return newItems;
};

export const getItemColor = (type) => {
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
