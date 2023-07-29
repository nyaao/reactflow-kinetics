import * as React from 'react';
import { Button, Grid } from '@mui/material';
import { DataGrid,  GridActionsCellItem, GridColDef, GridRowParams,} from '@mui/x-data-grid';
import { myTheme } from '../myTheme';
import { useCallback, useState } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { ExpDataDialog } from '../Diagram/ExpDataDialog';

type Props = {
  expData:{[symbol:string]:number}[],
  setExpData:(data:{[symbol:string]:number}[])=>void,
}
    //expData
    //[{id:0,time:0.0, '[A]':0.3, '[B]':0.0}]

export const ExpTableMain=(props:Props)=>{
  const [editingRow, setEditingRow] = useState<{[key:string]:number}|null>(null);
 
  // React.useEffect(()=>{
  //   console.log(props.expData);
  // },[props.expData])

  const columns: GridColDef[] = [
    ...Object.keys(props.expData[0]).filter(key=>key!=='id').map((symbol)=>(
      {
        field: symbol,
        headerName: symbol,
        width: 70,
        sortable: false 
      })),
    {
      field: "actions",
      type: "actions",
      headerName: "edit",
      // width: 30,
      headerAlign: "center",
      getActions: (params: GridRowParams) => [
        // params.id === 0 ? <></> :
        <GridActionsCellItem
          key={params.id}
          label="edit"
          showInMenu={false}
          icon={<EditIcon />}
          onClick={(e)=>{
            setEditingRow(props.expData.filter(r=>r.id===params.id)[0]);
          }}
        />,
        <GridActionsCellItem
          key={params.id}
          label="edit"
          showInMenu={false}
          icon={<AddIcon />}
          onClick={(e)=>{
            handleAddRow(Number(params.id));
          }}
        />,
        <GridActionsCellItem
          key={params.id}
          label="edit"
          showInMenu={false}
          icon={<RemoveIcon />}
          onClick={(e)=>{
            handleDelRow(Number(params.id))
          }}
        />,        
      ],      
    },    

  ];
  
  const handleAddRow=(id:number)=>{
    const newdata = {
      time:props.expData[id].time,
      ...Object.assign({},...Object.keys(props.expData[0]).filter(key=>key!=='id' && key!=='time').map((symbol)=>(
        {
          [symbol]:0  
        }
      )))
    }
    const newdatas = [...props.expData.slice(0,id),newdata,...props.expData.slice(id)].map((data,i)=>(Object.assign({},data,{id:i})))
    props.setExpData(newdatas)
  }

  const handleDelRow=(id:number)=>{
    if(props.expData.length>1){
      const newdatas = [...props.expData.slice(0,id),...props.expData.slice(id+1)].map((data,i)=>(Object.assign({},data,{id:i})))
      props.setExpData(newdatas);
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
        <Button disableElevation onClick={()=>console.log(props.expData)} size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>debug</Button>
        <Button disableElevation onClick={()=>console.log(props.expData)} size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>import</Button>
        <Button disableElevation onClick={()=>console.log(props.expData)} size="small" variant='outlined' sx={{margin:'2px', color:myTheme.palette.grey[400],borderColor:myTheme.palette.grey[400]}}>export</Button>

      <Grid item xs={12}>  
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