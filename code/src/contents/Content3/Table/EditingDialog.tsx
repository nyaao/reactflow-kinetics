import { Dialog, Typography, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { GridValidRowModel } from "@mui/x-data-grid";
import { useState } from "react";
import formatNumericText from "../../formatNumericText";


type Props = {
    onClose: (newrow: GridValidRowModel | null) => void;
    editingRow: GridValidRowModel | null;
  };

  const EditingDialog = (props:Props) => {
    const [tmpRow, setTmpRow] = useState<GridValidRowModel | null>(props.editingRow);

    const handleChange = (value: string, key: string) => {
      const newTmpRow = Object.assign({}, tmpRow, { [key]: formatNumericText(value) });
      setTmpRow(newTmpRow);
    };

    return (
      <Dialog open={true} onClose={() => {}}>
        <Typography sx={{ p: 1 }}>Title</Typography>
        <DialogContent>
          {tmpRow !== null &&
            Object.keys(tmpRow)
              .filter((key) => key !== 'id')
              .map((key, i) => {
                return (
                  <div key={i}>
                    <TextField
                      label={key}
                      value={tmpRow[key]}
                      onChange={(e) => handleChange(e.target.value, key)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                );
              })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose(tmpRow)}>OK</Button>
          <Button onClick={() => props.onClose(null)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default EditingDialog;
