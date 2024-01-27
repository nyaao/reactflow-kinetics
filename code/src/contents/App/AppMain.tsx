import { Backdrop, CircularProgress, Grid, Toolbar} from '@mui/material';
import AppBar from '../Menu/DrawerAppber';
import DrawerMenu from '../Menu/DrawerMenu';
import DrawerContentArea from '../Menu/DrawerContentArea';
import Content1Main from '../Content1/Content1Main';
import Content2Main from '../Content2/Content2Main';
import Content3Main from '../Content3/Content3Main';
import useAppState from './Hooks/useAppState';
import { useNodesState, useEdgesState } from 'reactflow';
import useReactionRateExpressions from './Hooks/useReactionRateExpression';
import useExpConcData from './Hooks/useExpConcData';
import useSelectedDataKeys from './Hooks/useSelectedDataKeys';
import useCalcConcData from './Hooks/useCalcConcData';
import useIntegralRange from './Hooks/useIntegralRange';
import useReactionRateConstant from './Hooks/useReactionRateConstant';
import useInitConc from './Hooks/useInitConc.tsx';
import useFileHandler from './Hooks/useFileHandler';
import useOptRanges from './Hooks/useOptRanges';

const AppMain=()=>{
  const [selectedMenu, isDrawerOpen,isCalculating, {setSelectedMenu, handleDrawerToggle, setIsCalculating}] = useAppState();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [keyTranslationSet,reactionRateExpression] = useReactionRateExpressions(nodes,edges);
  const [expConcData,setExpConcData]=useExpConcData({nodes, setNodes});
  const [reactionRateConstant, setReactionRateConstant] = useReactionRateConstant(nodes,setNodes);
  const [initConc] = useInitConc(nodes);
  const [calcConcData, handleCalcConcData] = useCalcConcData()
  const [integralRange, handleIntegralRange] = useIntegralRange();
  const [selectedDataKeys, setSelectedDataKeys] = useSelectedDataKeys(expConcData); // プロット有無、解析有無などのデータはContent2で設定するが、解析時にはこの情報が必要なので。最上位で管理する
  const [optRanges, handleOptRanges] = useOptRanges(nodes);

  const {handleSaveExcel, handleLoadExcel} = useFileHandler(setNodes,setEdges,setExpConcData,setSelectedDataKeys,handleIntegralRange,handleOptRanges);

  return(
    <>
      <AppBar
        onToggleDrawer={handleDrawerToggle}
        handleSaveExcel={()=>handleSaveExcel(nodes,edges,expConcData,calcConcData,selectedDataKeys,integralRange,optRanges)}
        handleLoadExcel={(files)=>handleLoadExcel(files)}
      />
      <DrawerMenu isDrawerOpen={isDrawerOpen} setState={setSelectedMenu}/>
      <DrawerContentArea open={isDrawerOpen}>
        <Toolbar/>
        <Grid container spacing={1} display='flex' alignItems='center'>
          <Grid item xs={12}>
            {selectedMenu==='Flow' &&
              <Content1Main
                nodes={nodes}
                setNodes={setNodes}
                onNodesChange={onNodesChange}
                edges={edges}
                setEdges={setEdges}
                onEdgesChange={onEdgesChange}
                keyTranslationSet={keyTranslationSet}
                reactionRateExpression={reactionRateExpression}
              />
            }
            {selectedMenu==='Graph' &&
              <Content2Main
                expConcData={expConcData}
                calcConcData={calcConcData}
                selectedDataKeys={selectedDataKeys}
                setSelectedDataKeys={setSelectedDataKeys}
                integralRange={integralRange}
                setIntegralRange={handleIntegralRange}
                reactionRateConstant={reactionRateConstant}
                setReactionRateConstant={setReactionRateConstant}
                handleCalcConcData={()=>handleCalcConcData(
                    keyTranslationSet,
                    reactionRateExpression,
                    initConc,
                    reactionRateConstant,
                    integralRange,
                    expConcData,
                    selectedDataKeys,
                    optRanges,
                    setReactionRateConstant,
                    handleOptRanges,
                    setIsCalculating
                  )}
                optRanges={optRanges}
                handleOptRanges={handleOptRanges}
              />
            }
            {selectedMenu==='Table' &&
              <Content3Main
                data={expConcData}
                setData={setExpConcData}
              />
            }
          </Grid>
        </Grid>
      </DrawerContentArea>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isCalculating}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default AppMain;
