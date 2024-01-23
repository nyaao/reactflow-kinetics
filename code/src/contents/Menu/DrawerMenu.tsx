import { Drawer } from "@mui/material"
import MyMenuItems from "./DrawerMenuItems"

type DrawerProps = {
    isDrawerOpen:boolean,
    setState:(v:'Flow'|'Graph'|'Table')=>void
  }

const DrawerMenu=(props:DrawerProps)=>{
  return(
    <Drawer
      sx={{
        width: 200,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 200,
        },
      }}
      variant="persistent"
      anchor="left"
      open={props.isDrawerOpen}
    >
      <MyMenuItems setState={props.setState}/>
    </Drawer>
  )
}

export default DrawerMenu;
