import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import { myTheme } from "../App/myTheme";
import { useRef } from "react";

type AppBarProps = {
    onToggleDrawer:()=>void,
    handleSaveExcel:()=>void,
    handleLoadExcel:(files:FileList|null) =>void
  }

const DrawerAppBar=(props:AppBarProps)=>{
  const inputRef = useRef<HTMLInputElement>(null);

  return(
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1 ,
        backgroundColor:myTheme.palette.primary.dark
      }}
    >
      <Toolbar>
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="end"
          onClick={props.onToggleDrawer}
          sx={{ mr: 2 }}
        >
          <MenuIcon/>
        </IconButton>
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="end"
          onClick={()=>inputRef.current!==null && inputRef.current.click()}
          sx={{ mr: 2 }}
        >
          <UploadFileIcon/>
          <input
            type="file"
            hidden
            accept='.xlsx,.xls'
            ref={inputRef}
            onChange={(e)=>props.handleLoadExcel(e.target.files)}
          />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="end"
          onClick={()=>props.handleSaveExcel()}
          sx={{ mr: 2 }}
        >
          <SaveIcon/>
        </IconButton>
        <Typography width={'100%'} align="center">Application</Typography>
      </Toolbar>
    </AppBar>
  )
}

export default DrawerAppBar;
