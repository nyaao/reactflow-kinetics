import React, { useState, useRef, useCallback, ChangeEvent } from 'react';
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
} from 'reactflow';

import SideBarMain from './SideBar/SideBarMain';
import { Box, Grid, Button } from '@mui/material';
import { MyAppBar } from './MyAppBar';
import { NodeDialog } from './Dialogs/NodeDialog';
import { EdgeDialog } from './Dialogs/EdgeDialog';
import { ExportExcel, ImportBackgroundNode, ImportExcel } from './FileHandler/FileHandler';
import { getNewNode, getNewEdgeParams } from './utils';
import { EdgeTypes, NodeTypes,} from './default';
import './default.ts'
import { myTheme } from './myTheme';
import 'reactflow/dist/style.css';
import { calc, calc2 } from './submit';
import { SchemeDialog } from './Dialogs/SchemeDialog';
import { CalcResultsDialog } from './Dialogs/CalcResultsDialog';



export default function ContentMain(){
  const reactFlowWrapper = useRef<HTMLDivElement|null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any|null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [doubleClickedNode, setDoubleClickedNode] = useState<Node|null>(null);
  const [doubleClickedEdge, setDoubleClickedEdge] = useState<Edge|null>(null);

  const [openSchemeDialog, setOpenSchemeDialog] = useState<boolean>(false);
  const [schemeData, setSchemeData] = useState<{[key:string]:string}|null>(null);
  const [rereadingData, setRereadingData] = useState<{[key:string]:string}|null>(null);
  const [calculatedData, setCalculatedData] = useState<{[key:number]:number[]}>({});


  // Edgeの追加処理
  const onConnect = useCallback((params: Edge<any> | Connection)=>{
      const newedgeparams = getNewEdgeParams(edges,params);
      const sourceNodeType = nodes.filter(n=>n.id===newedgeparams.source)[0].type
      const targetNodeType = nodes.filter(n=>n.id===newedgeparams.target)[0].type
      if(
        (sourceNodeType==='reactant' && targetNodeType==='intermediate') ||
        (sourceNodeType==='reactant' && targetNodeType==='product') ||
        (sourceNodeType==='reaction' && targetNodeType==='reaction')
      )return;
      setEdges((eds)=>addEdge(newedgeparams,eds));
    }
    ,[nodes,edges,setEdges]
  );

  // Edgeの繋ぎ変え処理(Edge Update)
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge<any>, newConnection: Connection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  // Nodeの追加処理
  const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event:{preventDefault:()=>void; dataTransfer:{getData:(arg0:string)=>any;}; clientX:number; clientY: number;}) => 
    {
      const newnode = getNewNode(event,reactFlowWrapper,reactFlowInstance,nodes);
      newnode!==undefined && setNodes((nds) => nds.concat(newnode))
    },
    [reactFlowInstance, nodes, setNodes]
  );

  // Nodeのプロパティ入力
  const handleNodeDoubleClick=useCallback((e: React.MouseEvent<Element, MouseEvent>,node: Node<any>)=>{
    setDoubleClickedNode(node);
    },
    [setDoubleClickedNode]
  )

  const handleNodeDialogClose=useCallback((node?:Node)=>{
    if(node!==undefined){
      const tmpnode = nodes.filter(n=> n.id!==node.id);
      const newnodes = [...tmpnode, node];
      setNodes(newnodes);
    }
    setDoubleClickedNode(null);
    },
    [nodes, setNodes, setDoubleClickedNode]
  )

  // Edgeのプロパティ入力
  const handleEdgeDoubleClick=useCallback((e: React.MouseEvent<Element, MouseEvent>,edge: Edge<any>)=>{
    setDoubleClickedEdge(edge);
    },
    [setDoubleClickedEdge]
  )

  const handleEdgeDialogClose=useCallback((edge?:Edge)=>{
    if(edge!==undefined){
      const tmpedge = edges.filter(e=> e.id!==edge.id);
      const newedges = [...tmpedge, edge];
      setEdges(newedges);
    }
    setDoubleClickedEdge(null);
    },
    [edges,setEdges,setDoubleClickedEdge]
  )

  // ファイル入出力
  const handleImport = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    ImportExcel(e,setNodes,setEdges);
  },[setEdges, setNodes]);

  const handleExport=useCallback((e:{ preventDefault: () => void; })=>{
    ExportExcel(e,nodes,edges);
  },[edges, nodes]);


  // 背景ノードの画像データ読込み
  const handleImportBG = React.useCallback((e:React.ChangeEvent<HTMLInputElement>) => {
    ImportBackgroundNode(e,setNodes);
  }, []);

  return (
    <div>
      <Button onClick={()=>{
        console.log("Nodes",nodes);
        console.log("Edges",edges);
        console.log("reredingData",rereadingData);
        console.log("schemeData",schemeData);
        console.log(calculatedData);
      }}>test</Button>

      <Button onClick={async()=>{
        const res = await calc(nodes,edges);
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
        setOpenSchemeDialog(true);
        setRereadingData(rereading);
        setSchemeData(scheme);
        
        }}>calc</Button>
      
      <Button onClick={async()=>{

        if(rereadingData!==null && schemeData!==null){
          const initY:{[key:string]:number} = Object.assign({},...nodes.filter(n=>n.type!=="reaction")
                                                  .map(rip=>({["Y["+rip.id.replace("m","")+"]"]:rip.data.initial_concentration})))

          const params:{[key:string]:number} = Object.assign({},...nodes.filter(n=>n.type==='reaction')
                                                   .map(rn=>({["k["+rn.id.replace("r","")+"]"]:rn.data.kinetic_constant})))
          const res = await calc2(schemeData,initY,params);
          const data = typeof(res.data)==='object' ? res.data : JSON.parse(res.data) //lambdaの場合は文字列で返してくる
          setCalculatedData(data);
        }
        }}>calc2</Button>
            
      <MyAppBar
        handleImport={handleImport}
        handleExport={handleExport}
        handleImportBG={handleImportBG}
      />
      <Box sx={{width:'100%', height:'85vh'}}>
        <Grid container>
          <Grid item xs={3}>
            <SideBarMain
              NodeTypeKeys={Object.keys(NodeTypes)} // 組込みのノードを使用しない場合はこっち
              Nodes={nodes}
              Edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
            />
          </Grid>

          <Grid item xs={9} height={'85vh'}>
            <ReactFlowProvider>
              <div style={{width:'100%', height:'85vh'}}  ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
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
                >
                  <Background style={{backgroundColor:myTheme.palette.grey[200]}}/>
                  <Controls />
                </ReactFlow>
                {doubleClickedNode!==null && <NodeDialog open={true} onClose={(node)=>handleNodeDialogClose(node)} node={doubleClickedNode} nodes={nodes}/>}
                {doubleClickedEdge!==null && <EdgeDialog open={true} onClose={(edge)=>handleEdgeDialogClose(edge)} edge={doubleClickedEdge}/>}
                {openSchemeDialog && <SchemeDialog open={true} onClose={()=>setOpenSchemeDialog(false)} schemedata={schemeData} rereadingdata={rereadingData}/>}
                {Object.keys(calculatedData).length >0 && <CalcResultsDialog open={true} onClose={()=>setCalculatedData({})} integrand={schemeData!==null ? Object.keys(schemeData):[]} calculatedData={calculatedData} />}
              </div>
            </ReactFlowProvider>
          </Grid>
        </Grid>
      </Box>

    </div>
  );
};




