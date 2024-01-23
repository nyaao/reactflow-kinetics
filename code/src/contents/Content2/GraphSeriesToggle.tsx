import { Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";

type GraphSeriesToggleProps={
  selectedDataKeys:{[key: string]: boolean}
  setSelectedDataKeys:(keys:{[key: string]: boolean})=>void;
}

export const GraphSeriesToggle=(props:GraphSeriesToggleProps)=>{
  return(
    <Grid container spacing={1} padding={1} display='flex' alignItems='center'>
      {props.selectedDataKeys!==null && Object.entries(props.selectedDataKeys).map(([key,value])=>{
      return <Grid item xs={12} key={key}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox
                            checked={value}
                            onChange={(e)=>props.setSelectedDataKeys({...props.selectedDataKeys, [key]:e.target.checked})}
                          />}
                  label={key}
                />
              </FormGroup>
            </Grid>
    })}
    </Grid>
  )
}
