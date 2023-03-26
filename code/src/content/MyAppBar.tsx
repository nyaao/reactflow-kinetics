import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu'
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { ChangeEvent, useRef, useState } from 'react';
import { myTheme } from "./myTheme";


type Props={
  handleImport:(e: ChangeEvent<HTMLInputElement>)=>void,
  handleExport:(e:{ preventDefault: () => void; })=>void,
  handleImportBG:(e: ChangeEvent<HTMLInputElement>)=>void,
  setView:(view:"reactflow"|"scheme"|"graph"|"table")=>void,
  handleShowDerivative:()=>void,
  handleSolveDerivative:()=>void,
}


export const MyAppBar=(props:Props)=>{

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputBGRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const fileUpload=()=>{
    inputRef.current!==null && inputRef.current.click();
  }

  const bgfileUpload=()=>{
    inputBGRef.current!==null && inputBGRef.current.click();
  }


  return (
    <Box sx={{flexGrow:1}}>
      <AppBar position="static" sx={{backgroundColor:myTheme.palette.primary.dark}}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClickListItem}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'lock-button',
              role: 'listbox',
            }}
          >
            <MenuItem onClick={fileUpload} dense>
              import
              <input
                type="file"
                hidden
                ref={inputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  e.target.files && props.handleImport(e);
                  setAnchorEl(null);
                }}
              />
            </MenuItem>
            <MenuItem onClick={(e)=>props.handleExport(e)} dense>
             export
            </MenuItem>
            <MenuItem onClick={bgfileUpload} dense>
              import background
              <input
                type="file"
                hidden
                ref={inputBGRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  e.target.files && props.handleImportBG(e);
                  setAnchorEl(null);
                }}
              />
            </MenuItem>            
          </Menu>
          
          <Divider orientation="vertical" flexItem />
          
          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={()=>props.setView("reactflow")}
          >
            <AccountTreeIcon/>
          </IconButton>

          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={()=>props.handleShowDerivative()}
          >
            <FunctionsIcon/>
          </IconButton>

          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={()=>props.handleSolveDerivative()}
          >
            <AutoGraphIcon />
          </IconButton>

          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={()=>props.setView("table")}
          >
            <FormatListBulletedIcon/>
          </IconButton>

        </Toolbar>
      </AppBar>
    </Box>
  )
}
