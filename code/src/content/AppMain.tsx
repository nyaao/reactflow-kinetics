import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemButton, Paper, Grid, Button, Menu, MenuItem } from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { ChangeEvent, useCallback, useRef, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { myTheme } from "./myTheme";
import FlowMain from "./ReactFlow/FlowMain";
import { Formulae } from "./Diagram/Formulae";
import { Infomation } from "./Diagram/Infomation";
import { ResultMain } from "./Results/ResultMain";
import { calc, calc2 } from "./submit";
import { Node,Edge, useEdgesState, useNodesState } from "reactflow";
import { ExportExcel, ImportExcel } from "./FileHandler/FileHandler";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -200,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }));
  
  export function AppMain() {
    const [isOpen, setOpenState] = useState<boolean>(false);
    const [view, setView] = useState<'diagram'|'result'>('diagram');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const inputRef = useRef<HTMLInputElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [schemeData, setSchemeData] = useState<{[key:string]:string}|null>(null);
    const [rereadingData, setRereadingData] = useState<{[key:string]:string}|null>(null);
    const [calculatedData, setCalculatedData] = useState<{[key:number]:number[]}>({});

    const toggleOpenState = (): void => {
      setOpenState(!isOpen);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const fileUpload=()=>{
      inputRef.current!==null && inputRef.current.click();
    }

    const handleImport = useCallback((e:ChangeEvent<HTMLInputElement>) => {
      ImportExcel(e,setNodes,setEdges,handleShowDerivative);
    },[setEdges, setNodes]);
  
    const handleExport=useCallback((e:{ preventDefault: () => void; })=>{
      ExportExcel(e,nodes,edges,schemeData);
    },[edges, nodes, schemeData]);
    
    const handleShowDerivative=async(NODES?:Node[],EDGES?:Edge[])=>{
      const tmpnodes = NODES===undefined ? nodes : NODES
      const tmpedges = EDGES===undefined ? edges : EDGES
      const res = await calc(tmpnodes,tmpedges);

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
      setRereadingData(rereading);
      setSchemeData(scheme);
    }    

    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <AppBar
            position="fixed"
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1 ,
                backgroundColor:myTheme.palette.primary.dark
            }}
          >
            <Toolbar>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="end"
                onClick={toggleOpenState}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                color="primary"
                sx={{ display: "block" }}
              >
                Application
              </Typography>
              <Button onClick={()=>{
                console.log("nodes",nodes)
                console.log("edges",edges)
                console.log("schemeData",schemeData)
                }}>debug</Button>
            </Toolbar>
          </AppBar>
        </Box>

        <Drawer
          sx={{
            width: 200,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 200,
              backgroundColor:myTheme.palette.primary.main
            },
          }}
          variant="persistent"
          anchor="left"
          open={isOpen}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItemButton>
                <ListItem onClick={(e)=>handleClickListItem(e)}>
                  <FileOpenIcon sx={{ color: myTheme.palette.primary.dark }}/>
                  <Typography sx={{ p:1,color: myTheme.palette.primary.dark }}>ファイル</Typography>
                </ListItem>
              </ListItemButton>
              <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'lock-button',
                  role: 'listbox',
                }}
              >
                <MenuItem onClick={()=>fileUpload()} dense>
                  import
                  <input
                    type="file"
                    hidden
                    ref={inputRef}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      e.target.files && handleImport(e);
                      setAnchorEl(null);
                    }}
                  />
                </MenuItem>       
                <MenuItem onClick={(e)=>handleExport(e)} dense>
                  export
                </MenuItem>                
              </Menu>
              <ListItemButton>
                <ListItem onClick={()=>{setView('diagram');setOpenState(false);}}>
                  <AccountTreeIcon sx={{ color: myTheme.palette.primary.dark }}/>
                  <Typography sx={{ p:1,color: myTheme.palette.primary.dark }}>ダイアグラム</Typography>
                </ListItem>
              </ListItemButton>
              <ListItemButton>
                <ListItem onClick={()=>{setView('result');setOpenState(false)}}>
                    <AutoGraphIcon sx={{ color: myTheme.palette.primary.dark }}/>
                    <Typography sx={{ p:1,color: myTheme.palette.primary.dark }}>計算結果</Typography>
                </ListItem>
              </ListItemButton>
            </List>
          </Box>
        </Drawer>


        <Main open={isOpen}>
          <Toolbar />
          <Grid container spacing={1} display='flex' alignItems='center'>
            {view==="diagram" && 
            <>
              <Grid item xs={3}>
              <Paper>
                <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
                  <Infomation
                    rereadingData={rereadingData}
                    schemeData={schemeData}
                    identifier="Y"
                  />
                </Box>
                </Paper>
              </Grid>   

              <Grid item xs={3}>
              <Paper>
                <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
                  <Infomation
                    rereadingData={rereadingData}
                    schemeData={schemeData}
                    identifier="k"
                  />
                </Box>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper>
                  <Box sx={{width:"100%",height:"20vh",overflow:'auto',backgroundColor:myTheme.palette.grey[200],borderRadius:5}}>
                    <Formulae
                      rereadingData={rereadingData}
                      schemeData={schemeData}
                    />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper>
                  <Box sx={{width:'100%', height:'65vh'}}>
                    <FlowMain
                      nodes={nodes}
                      setNodes={setNodes}
                      onNodesChange={onNodesChange}
                      edges={edges}
                      setEdges={setEdges}
                      onEdgesChange={onEdgesChange}
                      handleShowDerivative={handleShowDerivative}
                    />
                  </Box>
                </Paper>
              </Grid>
            </>
            }
            {view === "result" &&
            <ResultMain
              schemeData={schemeData}
              rereadingData={rereadingData}
              calculatedData={calculatedData}
              setCalculateData={setCalculatedData}
              nodes={nodes}
              setNodes={setNodes}
              xmin={0}
              xmax={100}
            />
            }
          </Grid>
        </Main>

      </Box>
    );
  }


  