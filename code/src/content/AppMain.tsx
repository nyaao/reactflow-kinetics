import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, ListItemButton, Paper, Grid, Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import React, { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { myTheme } from "./myTheme";
import FlowMain from "./ReactFlow/FlowMain";
import { Formulae } from "./Diagram/Formulae";
import { Infomation } from "./Diagram/Infomation";
import { ResultMain } from "./Results/ResultMain";
import { calc2 } from "./submit";

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
    const [isOpen, setOpenState] = useState<boolean>(true);
    const [view, setView] = useState<'diagram'|'result'>('diagram');
    const [schemeData, setSchemeData] = useState<{[key:string]:string}|null>(null);
    const [rereadingData, setRereadingData] = useState<{[key:string]:string}|null>(null);
    const [calculatedData, setCalculatedData] = useState<{[key:number]:number[]}>({});

    const toggleOpenState = (): void => {
      setOpenState(!isOpen);
    };

    // const handleSolveDerivative=async()=>{
    //   if(rereadingData!==null && schemeData!==null){
    //     const initY:{[key:string]:number} = Object.assign({},...nodes.filter(n=>n.type!=="reaction")
    //                                             .map(rip=>({["Y["+rip.id.replace("m","")+"]"]:rip.data.initial_concentration})))
  
    //     const params:{[key:string]:number} = Object.assign({},...nodes.filter(n=>n.type==='reaction')
    //                                              .map(rn=>({["k["+rn.id.replace("r","")+"]"]:rn.data.kinetic_constant})))
    //     const res = await calc2(schemeData,initY,params);
    //     const data = typeof(res.data)==='object' ? res.data : JSON.parse(res.data) //lambdaの場合は文字列で返してくる
    //     setCalculatedData(data);
    //   }
    // }

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
              <Button onClick={()=>console.log("")}>debug</Button>
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
                <ListItem onClick={()=>console.log()}>
                  <FileOpenIcon sx={{ color: myTheme.palette.primary.dark }}/>
                  <Typography sx={{ p:1,color: myTheme.palette.primary.dark }}>ファイル</Typography>
                </ListItem>
              </ListItemButton>
              <ListItemButton>
                <ListItem onClick={()=>setView('diagram')}>
                  <AccountTreeIcon sx={{ color: myTheme.palette.primary.dark }}/>
                  <Typography sx={{ p:1,color: myTheme.palette.primary.dark }}>ダイアグラム</Typography>
                </ListItem>
              </ListItemButton>
              <ListItemButton>
                <ListItem onClick={()=>setView('result')}>
                    <AutoGraphIcon sx={{ color: myTheme.palette.primary.dark }}/>
                    <Typography sx={{ p:1,color: myTheme.palette.primary.dark }}>計算結果表示</Typography>
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
            <Grid item xs={12}>
              <Paper>
                <Box sx={{width:'100%', height:'65vh'}}>
                  <FlowMain
                    rereadingData={rereadingData}
                    setRereadingData={setRereadingData}
                    schemeData={schemeData}
                    setSchemeData={setSchemeData}
                  />
                </Box>
              </Paper>
            </Grid>
            </>
            }
            {view === "result" &&
            <ResultMain
              schemeData={schemeData}
              calculatedData={calculatedData}
              nodes={[]}
              xmin={0}
              xmax={100}
            />
            }
            
          </Grid>
        </Main>

      </Box>
    );
  }


  