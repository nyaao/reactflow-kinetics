import { GridColDef, GridActionsCellItem, GridRowParams, GridValidRowModel } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useState } from "react";

export const useEditableTable = (initialData:{[key:string]:number}[]) => {
  const [editingRow, setEditingRow] = useState<GridValidRowModel|null>(null);
  const [rows, setRows] = useState<{[key:string]:number}[]>(initialData);

  const startEditing = useCallback((params:GridRowParams<any>) => {
    const foundRow = rows.find((row) => row.id === params.id);
    if(foundRow){setEditingRow(foundRow)}
  },[rows]);

  const addRow = useCallback((params:GridRowParams<any>) => {
    const clickedRowNumber = Number(params.id);
    const newRow = rows[clickedRowNumber];
    const newRows = [...rows.slice(0, clickedRowNumber), newRow, ...rows.slice(clickedRowNumber)].map((data, i) => ({ ...data, id: i }));
    setRows(newRows);
  },[rows]);

  const removeRow = useCallback((params:GridRowParams<any>) => {
    if (rows.length === 1) {
      return;
    }
    const clickedRowNumber = Number(params.id);
    const newRows = [...rows.slice(0, clickedRowNumber), ...rows.slice(clickedRowNumber + 1)].map((data, i) => ({ ...data, id: i }));
    setRows(newRows);
  },[rows]);

  const handleClose = useCallback((newRow:GridValidRowModel|null) => {
    if (newRow === null) {
      setEditingRow(null);
      return;
    }
    const numberNewRow = Object.fromEntries(Object.entries(newRow).map(([key,value])=>[key,Number(value)])) //EditingDialogで入力した値はstringなのでnumberに変換する
    const index = numberNewRow.id;
    const newRows = [...rows.slice(0, index), numberNewRow, ...rows.slice(index + 1)];
    setRows(newRows);
    setEditingRow(null);
  },[rows]);

  const columns: GridColDef[] = [
    ...Object.keys(initialData[0]).filter((key)=>key!=='id').map((key,i)=>(
      {field: key, headerName: key, width: 150, sortable: false, hideable: false, filterable: false}
    )),
    {
      field: 'actions',
      headerName: 'edit',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          label='edit'
          showInMenu={false}
          icon={<EditIcon />}
          onClick={() => startEditing(params)}
        />,
        <GridActionsCellItem
          key={params.id}
          label="add"
          showInMenu={false}
          icon={<AddIcon />}
          onClick={() => addRow(params)}
        />,
        <GridActionsCellItem
          key={params.id}
          label="remove"
          showInMenu={false}
          icon={<RemoveIcon />}
          onClick={() => removeRow(params)}
        />,
      ],
    },
  ];

  return { editingRow, rows, columns, handleClose };
};
