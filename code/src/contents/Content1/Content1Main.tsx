import { Box, Grid, Paper } from "@mui/material";
import { myTheme } from "../App/myTheme";
import MyFlow from "./Flow/MyFlowMain";
import { Node,Edge, OnEdgesChange, OnNodesChange } from "reactflow";
import { NodeCountMonitor } from "./NodeCountMonitor";
import MathExpressionViewer from "./MathExpressionViewer";

type Content1MainProps={
  nodes: Node[],
  setNodes: React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>>,
  onNodesChange: OnNodesChange,
  edges: Edge<any>[],
  setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>,
  onEdgesChange: OnEdgesChange,
  keyTranslationSet:{[key:string]:string}|null
  reactionRateExpression:{[key:string]:string}|null
}

const Content1Main=(props:Content1MainProps)=>{

  return (
    <Grid container spacing={1} display='flex' alignItems='center'>
      <Grid item xs={3}>
        <Paper>
          <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <NodeCountMonitor
              title='【化学種】'
              nodes={props.nodes.filter(node=>node.type!=='reaction')}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={3}>
      <Paper>
        <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
          <NodeCountMonitor
            title='【反応】'
            nodes={props.nodes.filter(node=>node.type==='reaction')}
          />
        </Box>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper>
          <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
            <MathExpressionViewer
              reactionRateExpression={props.reactionRateExpression}
              keyTranslationSet={props.keyTranslationSet}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper>
          <Box sx={{width:'100%', height:'65vh'}}>
            <MyFlow
              nodes={props.nodes}
              setNodes={props.setNodes}
              onNodesChange={props.onNodesChange}
              edges={props.edges}
              setEdges={props.setEdges}
              onEdgesChange={props.onEdgesChange}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Content1Main;
