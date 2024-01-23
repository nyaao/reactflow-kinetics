import { useCallback } from 'react';
import { Node,Edge } from 'reactflow';

type UseDialogActionsProps = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setDoubleClickedNode: React.Dispatch<React.SetStateAction<Node|null>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setDoubleClickedEdge: React.Dispatch<React.SetStateAction<Edge|null>>;
};

const useDialogActions = ({setNodes, setDoubleClickedNode,setEdges, setDoubleClickedEdge}:UseDialogActionsProps) => {

  const handleNodeDialogClose = useCallback((nodes:Node[], node?:Node) => {
    if (node === undefined) {
      setDoubleClickedNode(null);
      return;
    }
    const tmpnode = nodes.filter((n) => n.id !== node.id);
    const newnodes = [...tmpnode, node];
    setNodes(newnodes);
    setDoubleClickedNode(null);
  }, [setNodes, setDoubleClickedNode]);

  const handleNodeDoubleClick = useCallback((_e: React.MouseEvent<Element, MouseEvent>,node:Node) => {
    setDoubleClickedNode(node);
  }, [setDoubleClickedNode]);

  const handleEdgeDialogClose = useCallback((edges:Edge[], edge?:Edge) => {
    if (edge === undefined) {
      setDoubleClickedEdge(null);
      return;
    }
    const tmpedge = edges.filter((e) => e.id !== edge.id);
    const newedges = [...tmpedge, edge];
    setEdges(newedges);
    setDoubleClickedEdge(null);
  }, [setEdges, setDoubleClickedEdge]);

  const handleEdgeDoubleClick = useCallback((_e: React.MouseEvent<Element, MouseEvent>,edge:Edge) => {
    setDoubleClickedEdge(edge);
  }, [setDoubleClickedEdge]);

  return [{ handleNodeDialogClose, handleNodeDoubleClick,handleEdgeDialogClose, handleEdgeDoubleClick }];
};

export default useDialogActions;
