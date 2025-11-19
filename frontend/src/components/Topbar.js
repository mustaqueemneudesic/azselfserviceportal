import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, Button } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Topbar(){
  const [anchor, setAnchor] = React.useState(null);
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>Organization</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">MyOrg</Typography>
          <IconButton size="small"><ArrowDropDownIcon/></IconButton>
          <Button variant="outlined" size="small" sx={{ ml:2 }} href="/api/auth/login">Login</Button>
          <IconButton sx={{ ml:2 }} onClick={(e)=>setAnchor(e.currentTarget)}>
            <Avatar>U</Avatar>
          </IconButton>
        </Box>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)}>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
