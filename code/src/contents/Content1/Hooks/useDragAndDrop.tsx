import React, { useCallback } from 'react';
import { Node, ReactFlowInstance } from 'reactflow';
import useCustomNodeCreation from './useCustomNodeCreation';

type UseDragAndDropProps = {
    nodes:Node[],
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    reactFlowInstance: ReactFlowInstance | null;
  };

const useDragAndDrop = ({nodes,setNodes, reactFlowInstance}:UseDragAndDropProps) => {
  const createCustomNodeParams = useCustomNodeCreation(nodes);

  const onDrop = useCallback(
    (event:React.DragEvent<HTMLDivElement>) => {
      const newnode:Node|undefined = createCustomNodeParams(event, reactFlowInstance);
      if(!newnode){return;}
      setNodes((prevNodes) => prevNodes.concat(newnode));
    },
    [createCustomNodeParams, reactFlowInstance, setNodes]
  );

  const onDragStart = useCallback(
    (event:React.DragEvent<HTMLDivElement>, nodeType:string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    },
    []
  );

  const onDragOver = useCallback(
    (event:React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    []
  );

  return [{ onDrop, onDragStart, onDragOver }];
};

export default useDragAndDrop;
