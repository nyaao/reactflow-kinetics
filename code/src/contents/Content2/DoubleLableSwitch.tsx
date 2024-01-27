import { Stack, Typography} from "@mui/material"
import AntSwitch from "./Styles/AntSwitch";

type Props={
  offLabel:string,
  onLabel:string,
  state: boolean,
  onChange:(value:boolean)=>void,
}

const DoubleLabelSwitch=(props:Props)=>{

  return(
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>{props.offLabel}</Typography>
        <AntSwitch
          checked={props.state}
          onChange={(e)=>props.onChange(e.target.checked)}
          // disabled
        />
      <Typography>{props.onLabel}</Typography>
    </Stack>
  )
}

export default DoubleLabelSwitch
