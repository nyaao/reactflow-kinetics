import React, { useState, useRef, useCallback, ChangeEvent, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  Edge,
  Node,
  Background,
  updateEdge,
  Panel,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';

import SideBarMain from './SideBar/SideBarMain';
import { NodeDialog } from './Dialogs/NodeDialog';
import { EdgeDialog } from './Dialogs/EdgeDialog';
import { ExportExcel, ImportBackgroundNode, ImportExcel } from '../FileHandler/FileHandler';
import { getNewNode, getNewEdgeParams } from '../utils';
import { EdgeTypes, NodeTypes,} from '../default';
import { myTheme } from '../myTheme';
import 'reactflow/dist/style.css';
import { calc, calc2 } from '../submit';
import { GraphResult } from '../Results/GraphResult';
import { SchemeResult } from '../Results/SchemeResult';
import { TableResult } from '../Results/TableResult';
import { Button } from '@mui/material';

type Props={
  rereadingData:{[key:string]:string}|null,
  setRereadingData:(data:{[key:string]:string}|null)=>void,
  schemeData:{[key:string]:string}|null,
  setSchemeData:(data:{[key:string]:string}|null)=>void,
  nodes: Node<any, string | undefined>[],
  setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>,
  onNodesChange: OnNodesChange,
  edges: Edge<any>[],
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>,
  onEdgesChange: OnEdgesChange
}

export default function FlowMain(props:Props){
  const reactFlowWrapper = useRef<HTMLDivElement|null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any|null>(null);
  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [doubleClickedNode, setDoubleClickedNode] = useState<Node|null>(null);
  const [doubleClickedEdge, setDoubleClickedEdge] = useState<Edge|null>(null);
  // const [openSchemeDialog, setOpenSchemeDialog] = useState<boolean>(false);

  const [calculatedData, setCalculatedData] = useState<{[key:number]:number[]}>({});
  const [view, setView] = useState<"reactflow"|"scheme"|"graph"|"table">("reactflow");
  
  // Edgeの追加処理
  const onConnect = useCallback((params: Edge<any> | Connection)=>{
      const newedgeparams = getNewEdgeParams(props.edges,params);
      const sourceNodeType = props.nodes.filter(n=>n.id===newedgeparams.source)[0].type
      const targetNodeType = props.nodes.filter(n=>n.id===newedgeparams.target)[0].type
      if(
        (sourceNodeType==='reactant' && targetNodeType==='intermediate') ||
        (sourceNodeType==='reactant' && targetNodeType==='product') ||
        (sourceNodeType==='reaction' && targetNodeType==='reaction')
      )return;
      props.setEdges((eds)=>addEdge(newedgeparams,eds));
      
      const newedges:Edge<any>[] = [...props.edges,newedgeparams]
      handleShowDerivative(props.nodes,newedges);
    }
    ,[props.nodes,props.edges,props.setEdges]
  );

  // Edgeの繋ぎ変え処理(Edge Update)
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge<any>, newConnection: Connection) => props.setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  // Nodeの追加処理
  const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event:{preventDefault:()=>void; dataTransfer:{getData:(arg0:string)=>any;}; clientX:number; clientY: number;}) => 
    {
      const newnode = getNewNode(event,reactFlowWrapper,reactFlowInstance,props.nodes);
      newnode!==undefined && props.setNodes((nds) => nds.concat(newnode))
    },
    [reactFlowInstance, props.nodes, props.setNodes]
  );

  // Nodeのプロパティ入力
  const handleNodeDoubleClick=useCallback((e: React.MouseEvent<Element, MouseEvent>,node: Node<any>)=>{
    setDoubleClickedNode(node);
    },
    [setDoubleClickedNode]
  )

  const handleNodeDialogClose=useCallback((node?:Node)=>{
    if(node!==undefined){
      const tmpnode = props.nodes.filter(n=> n.id!==node.id);
      const newnodes = [...tmpnode, node];
      props.setNodes(newnodes);
    }
    setDoubleClickedNode(null);
    },
    [props.nodes, props.setNodes, setDoubleClickedNode]
  )

  // Edgeのプロパティ入力
  const handleEdgeDoubleClick=useCallback((e: React.MouseEvent<Element, MouseEvent>,edge: Edge<any>)=>{
    setDoubleClickedEdge(edge);
    },
    [setDoubleClickedEdge]
  )

  const handleEdgeDialogClose=useCallback((edge?:Edge)=>{
    if(edge!==undefined){
      const tmpedge = props.edges.filter(e=> e.id!==edge.id);
      const newedges = [...tmpedge, edge];
      props.setEdges(newedges);
    }
    setDoubleClickedEdge(null);
    },
    [props.edges,props.setEdges,setDoubleClickedEdge]
  )

  // ファイル入出力
  const handleImport = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    ImportExcel(e,props.setNodes,props.setEdges);
  },[props.setEdges, props.setNodes]);

  const handleExport=useCallback((e:{ preventDefault: () => void; })=>{
    ExportExcel(e,props.nodes,props.edges);
  },[props.edges, props.nodes]);

  const handleShowDerivative=async(NODES:Node[],EDGES:Edge[])=>{
    const res = await calc(NODES,EDGES);
    console.log(res);
    
    const rereading_integrand = Object.assign({},...res.newnodes
      .filter((nn)=>nn.type!=='reaction')
      .map((nn)=>(
      {["Y["+nn.id.replace("m","")+"]"]:"["+nn.data.symbol+"]"}
    )));

    const rereading_reaction = Object.assign({},...res.newnodes
      .filter((nn)=>nn.type==='reaction')
      .map((nn)=>(
      {["k["+nn.id.replace("r","")+"]"]:"k_"+nn.id.replace("r","")}
    )));        

    const rereading=Object.assign({},rereading_integrand,rereading_reaction)

    const scheme = Object.assign({},...res.newnodes
      .filter((nn)=>nn.type!=='reaction')                    
      .map((nn)=>(
      {["Y["+nn.id.replace("m","")+"]"]:nn.data.equation}
    )));

    console.log(scheme);
    console.log(rereading);
    // setOpenSchemeDialog(true);
    props.setRereadingData(rereading);
    props.setSchemeData(scheme);
    // setView("scheme");
  }

  // const handleSolveDerivative=async()=>{
  //   if(props.rereadingData!==null && props.schemeData!==null){
  //     const initY:{[key:string]:number} = Object.assign({},...nodes.filter(n=>n.type!=="reaction")
  //                                             .map(rip=>({["Y["+rip.id.replace("m","")+"]"]:rip.data.initial_concentration})))

  //     const params:{[key:string]:number} = Object.assign({},...nodes.filter(n=>n.type==='reaction')
  //                                              .map(rn=>({["k["+rn.id.replace("r","")+"]"]:rn.data.kinetic_constant})))
  //     const res = await calc2(props.schemeData,initY,params);
  //     const data = typeof(res.data)==='object' ? res.data : JSON.parse(res.data) //lambdaの場合は文字列で返してくる
  //     setCalculatedData(data);
  //   }
  //   setView('graph');
  // }


  // 背景ノードの画像データ読込み
  const handleImportBG = React.useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    ImportBackgroundNode(e,props.setNodes);
  }, []);

  return (
    <div>
      {/* <Button onClick={()=>{
        console.log("Nodes",nodes);
        console.log("Edges",edges);
        console.log("reredingData",rereadingData);
        console.log("schemeData",schemeData);
        console.log(calculatedData);
      }}>test</Button>
       */}

      {/* <MyAppBar
        handleImport={handleImport}
        handleExport={handleExport}
        handleImportBG={handleImportBG}
        setView={setView}
        handleShowDerivative={handleShowDerivative}
        handleSolveDerivative={handleSolveDerivative}
      /> */}
        {view==="reactflow" && 
          <ReactFlowProvider>
            <div style={{width:'100%', height:'65vh'}}  ref={reactFlowWrapper}>
              <ReactFlow
                nodes={props.nodes}
                edges={props.edges}
                onNodesChange={props.onNodesChange}
                onEdgesChange={props.onEdgesChange}
                onEdgeUpdate={onEdgeUpdate}
                nodeTypes={NodeTypes}
                edgeTypes={EdgeTypes}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onEdgeDoubleClick={(event, edge)=>handleEdgeDoubleClick(event,edge)}
                onNodeDoubleClick={(event, node)=>handleNodeDoubleClick(event,node)}
                fitView
                // style={reactFlowStyle}
              >
              <Background style={{backgroundColor:myTheme.palette.grey[200],borderRadius:20}}/>
              <Controls />
              <Panel position="top-left">
                {/* <Button onClick={()=>handleShowDerivative(nodes,edges)}>test</Button>
                <Button onClick={()=>console.log(nodes,edges)}>test</Button> */}
                <SideBarMain
                  NodeTypeKeys={Object.keys(NodeTypes)} // 組込みのノードを使用しない場合はこっち
                  Nodes={props.nodes}
                  Edges={props.edges}
                  setNodes={props.setNodes}
                  setEdges={props.setEdges}
                />
              </Panel>
              </ReactFlow>
              {doubleClickedNode!==null && <NodeDialog open={true} onClose={(node)=>handleNodeDialogClose(node)} node={doubleClickedNode} nodes={props.nodes}/>}
              {doubleClickedEdge!==null && <EdgeDialog open={true} onClose={(edge)=>handleEdgeDialogClose(edge)} edge={doubleClickedEdge}/>}
              {/* {openSchemeDialog && <SchemeDialog open={true} onClose={()=>setOpenSchemeDialog(false)} schemedata={schemeData} rereadingdata={rereadingData}/>} */}
            </div>
          </ReactFlowProvider>
        
          
        } 
        {/* {(view==="scheme") &&
          <SchemeResult
            schemedata={props.schemeData}
            rereadingdata={props.rereadingData}
          />
        }        
        {(view==="graph" && Object.keys(calculatedData).length>0) &&
          <GraphResult
            integrand={props.schemeData!==null ? Object.keys(props.schemeData):[]}
            calculatedData={calculatedData}
            nodes={nodes}
            xmin={0}
            xmax={100}
          />
        }
        {(view==="table" && Object.keys(calculatedData).length>0) &&
        <TableResult
          integrand={props.schemeData!==null ? Object.keys(props.schemeData):[]}
          calculatedData={calculatedData}
          nodes={nodes}
        />
        }         */}
    </div>
  );
};




