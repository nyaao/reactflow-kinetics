import { List, ListItemButton, ListItemText, Toolbar } from "@mui/material"

type MenuItemsProps= {
  setState:(v:'Flow'|'Graph'|'Table')=>void
}

const DrawerMenuItems=(props:MenuItemsProps)=>{
  return (
    <>
      <Toolbar />
      <List>
        <ListItemButton>
          <ListItemText primary={'diagrams'} onClick={()=>props.setState('Flow')}/>
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary={'graph'} onClick={()=>props.setState('Graph')}/>
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary={'table'} onClick={()=>props.setState('Table')}/>
        </ListItemButton>
      </List>
    </>
  )
}

  export default DrawerMenuItems;
