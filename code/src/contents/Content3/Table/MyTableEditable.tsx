import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import EditingDialog from "./EditingDialog";
import useParentHeight from "../Hooks/useParentHeight";
import { useEditableTable } from "../Hooks/useEditableTable";

type TableEditableProps={
  data:{[key:string]:number}[],
  setData:(data:{[key:string]:number}[])=>void,
}

export const TableEditable = (props:TableEditableProps) => {
  const { editingRow, rows, columns, handleClose } = useEditableTable(props.data)
  const parentHeight = useParentHeight('datagrid-parent-container');

  useEffect(()=>{
    const newdata = rows; //キャストしない方がいいか
    props.setData(newdata);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[rows])


  return (
    <div id='datagrid-parent-container' style={{ height:'60vh',padding: '10px', margin:'0px' }}>
        <DataGrid  rows={rows} columns={columns} style={{ height: parentHeight }}/>
        {editingRow && <EditingDialog onClose={handleClose} editingRow={editingRow} />}
    </div>
  );
};
