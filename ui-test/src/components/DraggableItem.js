import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { Box } from "@material-ui/core";
import { getItemColor } from "../utils";

const DraggableItem = ({ type, subType, color, children, InputComponent, onDragBegin, parentId, params }) => {
  const [dragParams, setDragParams] = useState(params);
  const dragParamsRef = useRef(dragParams);

  useEffect(() => {
    dragParamsRef.current = dragParams;
  }, [dragParams]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: () => {
      return {
        type,
        subType,
        params: dragParamsRef.current,
        parentId,
        isNew: true,
        selectorValue: dragParamsRef.current.reduce((acc, cur) => cur.type || "", ""),
      };
    },
    canDrag: () => {
      if (InputComponent && dragParams.some(param => param.value?.trim() === "")) {
        window.alert("Please fill in the input before dragging!");
        return false;
      }
      return true;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log("item——end:", item);
      if (monitor.didDrop()) {
        setDragParams(dragParams.map(p => ({ value: "", type: "" })));
      }
    },
  }));
  const handleInputChange1 = (index, key, newValue) => {
    const newDragParams = [...dragParams];
    newDragParams[index][key] = newValue;
    setDragParams(newDragParams);
  };
  const handleInputChange = (index, event) => {
    const newDragParams = [...dragParams];
    console.log("event.target", event.target.value)
    newDragParams[index].value = event.target.value;
    setDragParams(newDragParams);
  };
  const handleSeInputChange = (index, event) => {
    const newDragParams = [...dragParams];
    console.log("event.target", event.target.value)
    newDragParams[index].textValue = event.target.value;
    setDragParams(newDragParams);
  };
  const handleSelectorChange = (index, event) => {
    const newDragParams = [...dragParams];
    newDragParams[index].type = event.target.value;
    setDragParams(newDragParams);
  };

  const InputComponents = () => (
    dragParams.map((param, idx) => {
      console.log("param at index", idx, ":", param);
      return (
        <InputComponent
          key={idx}
          onChange={(e) => handleInputChange(idx, e)}
          onSeChange={(e) => handleSeInputChange(idx, e)}
          onSelectorChange={(e) => handleSelectorChange(idx, e)}
          onUrlChange={(e) => handleInputChange1(idx, 'url',  e.target.value)}
          onStatusCodeChange={(e) => handleInputChange1(idx, 'statusCode',  e.target.value)}
          onWidthChange={(e) => handleInputChange1(idx, 'width', e.target.value)}
          onHeightChange={(e) => handleInputChange1(idx, 'height', e.target.value)}
          oncookieNameChange={(e) => handleInputChange1(idx, 'cookieName', e.target.value)}
          oncookieValueChange={(e) => handleInputChange1(idx, 'cookieValue', e.target.value)}
          onSourceLocatorTypeChange={(e) => handleInputChange1(idx, 'sourceLocatorType', e.target.value)}
          onSourceLocatorValueChange={(e) => handleInputChange1(idx, 'sourceLocatorValue', e.target.value)}
          onTargetLocatorTypeChange={(e) => handleInputChange1(idx, 'targetLocatorType', e.target.value)}
          onTargetLocatorValueChange={(e) => handleInputChange1(idx, 'targetLocatorValue', e.target.value)}
          sourceLocatorType={param.sourceLocatorType}
          sourceLocatorValue={param.sourceLocatorValue}
          targetLocatorType={param.targetLocatorType}
          targetLocatorValue={param.targetLocatorValue}
          url={param.url}
          width={param.width}
          height={param.height}
          statusCode={param.statusCode}
          expectMatch={param.expectMatch}
          value={param.value}
          textValue={param.textValue}
          selectorValue={param.type}
          cookieName={param.cookieName}
          cookieValue={param.cookieValue}
          locatorType={param.locatorType}
          locatorValue={param.locatorValue}
          ExpectedValue={param.ExpectedValue}
        />
      );
    })
  );


  return (
    <Box
      ref={drag}
      style={{
        padding: 8,
        margin: 8,
        borderRadius: 4,
        backgroundColor: getItemColor(type),
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      {children}
      {subType && (
        <Box style={{ marginTop: 8 }}>
          <p>{subType}</p>
        </Box>
      )}
      {InputComponent && <InputComponents />}
    </Box>
  );
};

export default DraggableItem;
