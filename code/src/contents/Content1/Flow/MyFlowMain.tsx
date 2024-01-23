import { useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  Panel,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeDialog } from './Node/NodeDialog';
import useNodeDialogActions from '../Hooks/useDialogActions';
import { ReactionNode, MaterialNode } from './Node/CustomNode';
import { EdgeDialog } from './Edge/EdgeDialog';
import DraggableNodePalette from './DraggableNodePalette';
import useDragAndDrop from '../Hooks/useDragAndDrop';
import useOnConnect from '../Hooks/useOnConnect';

const nodeTypes = {
  reaction: ReactionNode,
  reactant: MaterialNode,
  product: MaterialNode,
  intermediate: MaterialNode,
};

type MyFlowProps={
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>,
  onNodesChange: OnNodesChange,
  edges: Edge<any>[],
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>,
  onEdgesChange: OnEdgesChange,
}

const MyFlow = (props:MyFlowProps) => {
  const [doubleClickedNode, setDoubleClickedNode] = useState<Node|null>(null);
  const [doubleClickedEdge, setDoubleClickedEdge] = useState<Edge|null>(null);
  const [{handleNodeDialogClose, handleNodeDoubleClick,handleEdgeDialogClose, handleEdgeDoubleClick}] = useNodeDialogActions({setNodes:props.setNodes,setDoubleClickedNode,setEdges:props.setEdges,setDoubleClickedEdge});
  const [reactFlowInstance, setReactFlowInstance] = useState<any|null>(null);
  const [{onDrop, onDragStart, onDragOver}] = useDragAndDrop({nodes:props.nodes,setNodes:props.setNodes,reactFlowInstance});
  const [{onConnect}] = useOnConnect({setEdges:props.setEdges});

  return (
    <div style={{width:'100%', height:'65vh', padding:'5px'}}>
      <ReactFlow
        nodes={props.nodes}
        edges={props.edges}
        onNodesChange={props.onNodesChange}
        onEdgesChange={props.onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={handleNodeDoubleClick}
        onEdgeDoubleClick={handleEdgeDoubleClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        attributionPosition="top-right"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
        <Panel position='top-left' style={{width:'10%'}}>
          <DraggableNodePalette
            onDragStart={onDragStart}
          />
        </Panel>
      </ReactFlow>
      {doubleClickedNode!==null && <NodeDialog open={true} onClose={(node)=>handleNodeDialogClose(props.nodes,node)} node={doubleClickedNode}/>}
      {doubleClickedEdge!==null && <EdgeDialog open={true} onClose={(edge)=>handleEdgeDialogClose(props.edges,edge)} edge={doubleClickedEdge}/>}
    </div>
  );
};

export default MyFlow;
