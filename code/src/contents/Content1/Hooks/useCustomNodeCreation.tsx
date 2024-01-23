import { Node, XYPosition, ReactFlowInstance } from "reactflow";
import useNodeIDManager from "./useNodeIDManager";
import { useCallback } from "react";

const convertNumberToExcelColumn = (num: number): string | null => {
  if (num <= 0) {
    return null;
  }

  let temp,
    letter = '';
  while (num > 0) {
    temp = (num - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    num = (num - temp - 1) / 26;
  }
  return letter;
};


const useCustomNodeCreation=(nodes:Node[])=>{
  const getNextID = useNodeIDManager();

  const getDropPosition=useCallback((
    event: React.DragEvent<HTMLDivElement>,
    reactFlowInstance:ReactFlowInstance | null,
  )=>{
    if (reactFlowInstance===null){return;}
    // nodeを追加する位置の取得
    const position:XYPosition = reactFlowInstance.screenToFlowPosition ({
      x: event.clientX,
      y: event.clientY,
    });
    return position
  },[])

  const getNodeType=useCallback((
    event: React.DragEvent<HTMLDivElement>,
    reactFlowInstance:ReactFlowInstance | null,
  )=>{
    if (reactFlowInstance===null){return;}
    // onDragStartで渡されたnodeTypeを取得する
    return event.dataTransfer.getData('application/reactflow');
  },[])

  const createCustomNodeParams=useCallback((
      event: React.DragEvent<HTMLDivElement>,
      reactFlowInstance:ReactFlowInstance | null,
    ):Node|undefined=>{

    const position = getDropPosition(event,reactFlowInstance);
    if(position===undefined){return;}// check if the dropped position is valid

    const nodeType = getNodeType(event,reactFlowInstance);
    if (typeof nodeType === 'undefined' || !nodeType) {return undefined;} // check if the dropped element is valid

    const nextid = nodeType==='reaction' ?
      'r'+getNextID(nodes.filter(node=>node.type==='reaction').map(node=>node.id))
      :
      'm'+getNextID(nodes.filter(node=>node.type!=='reaction').map(node=>node.id))

    return {
      id: nextid,
      position: position,
      type:nodeType,
      data: {
        symbol: {
          value:nodeType!=='reaction' ? convertNumberToExcelColumn(Number(nextid.slice(1))):nextid.replace('r','k'),
          type:String
        },
        initial_concentration:{
          value:nodeType==='reaction' ?
            '--'
          :
            nodeType==='reactant' ?
              0.1
            :
              0.0,
          type:Number
        },
        kinetic_constant:{
          value:nodeType==='reaction' ? 0.1 : '--',
          type:Number
        },
      },
    }
  },[getDropPosition, getNextID, getNodeType, nodes]);

  return createCustomNodeParams;
}

export default useCustomNodeCreation;
