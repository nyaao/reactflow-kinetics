import * as React from 'react';
import { Button, Grid } from '@mui/material';
import { DataGrid,  GridActionsCellItem, GridColDef, GridRowParams,} from '@mui/x-data-grid';
import { myTheme } from '../myTheme';
import { useCallback, useState } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import { ExpDataDialog } from '../Diagram/ExpDataDialog';

type Props = {
  setState:(stae:"param"|"data")=>void,
  expData:{[symbol:string]:number}[],
  setExpData:(data:{[symbol:string]:number}[])=>void,
}
    //expData
    //[{id:0,time:0.0, '[A]':0.3, '[B]':0.0}]

export const ExpTable=(props:Props)=>{
  const [editingRow, setEditingRow] = useState<{[key:string]:number}|null>(null);
 
  React.useEffect(()=>{
    console.log(props.expData);
  },[props.expData])

  const columns: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "edit",
      width: 30,
      headerAlign: "center",
      getActions: (params: GridRowParams) => [
        params.id === 0 ? <></> :
        <GridActionsCellItem
          key={params.id}
          label="edit"
          showInMenu={false}
          icon={<EditIcon />}
          onClick={(e)=>{
            setEditingRow(props.expData.filter(r=>r.id===params.id)[0]);
          }}
        />,
      ],      
    },    
    ...Object.keys(props.expData[0]).filter(key=>key!=='id').map((symbol)=>(
      {
        field: symbol,
        headerName: symbol,
        width: 70,
        sortable: false 
      })),
  ];
  
  const handleAddRow=()=>{
    const newdata = {
      id:props.expData.length,
      time:props.expData[props.expData.length-1].time+1,
      ...Object.assign({},...Object.keys(props.expData[0]).filter(key=>key!=='id' && key!=='time').map((symbol)=>(
        {
          [symbol]:0  
        }
      )))
    }
    props.setExpData([...props.expData,newdata])
  }

  const handleDelRow=()=>{
    if(props.expData.length>1){
      props.setExpData(props.expData.slice(0,-1));
    }
  }

  const handleExpDataDialogClose=useCallback((data?:{[key:string]:number})=>{
    if(data!==undefined){
      const newdatas = [...props.expData.slice(0,data.id),data,...props.expData.slice(data.id+1)]
      props.setExpData(newdatas);      
    }
    setEditingRow(null);
    },
    [props.expData]
  )

  return (
    <>
      <Grid item xs={2}>
        <Button disableElevation onClick={()=>props.setState('param')} size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>切替</Button>
        <Button disableElevation onClick={()=>handleAddRow()} size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>行追加</Button>
        <Button disableElevation onClick={()=>handleDelRow()} size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>行削除</Button>
        <Button disableElevation onClick={()=>console.log(props.expData)} size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>debug</Button>
      </Grid>
      <Grid item xs={10}>  
        <DataGrid
          rows={props.expData}
          columns={columns}
          density='compact'
          columnHeaderHeight={23}
          columnThreshold={10}
          hideFooter
          disableColumnFilter
          autoHeight
        />
      </Grid>
      {editingRow && <ExpDataDialog open={true} onClose={(row)=>handleExpDataDialogClose(row)} editingrow={editingRow}/>}
    </>
    );
}