import { Stack, Typography} from "@mui/material"
import AntSwitch from "./Styles/AntSwitch";

type Props={
  offLabel:string,
  onLabel:string,
  state: boolean,
  setState:(state:boolean)=>void,
}

const DoubleLabelSwitch=(props:Props)=>{

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setState(event.target.checked);
  };

  return(
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>{props.offLabel}</Typography>
        <AntSwitch
          checked={props.state}
          onChange={handleChange}
          disabled
        />
      <Typography>{props.onLabel}</Typography>
    </Stack>
  )
}

export default DoubleLabelSwitch
