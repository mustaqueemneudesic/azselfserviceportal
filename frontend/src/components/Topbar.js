import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Avatar, Button } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function Topbar(){
  const [anchor, setAnchor] = React.useState(null);
  const [userName, setUserName] = React.useState(localStorage.getItem('user_name') || null);

  React.useEffect(()=>{
    const nm = localStorage.getItem('user_name');
    if (nm) setUserName(nm);
  }, []);
  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>Organization</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">MyOrg</Typography>
          <IconButton size="small"><ArrowDropDownIcon/></IconButton>
          {!userName ? (
            <Button variant="outlined" size="small" sx={{ ml:2 }} href="/api/auth/login">Login</Button>
          ) : (
            <Typography variant="body2" sx={{ ml:2 }}>{userName}</Typography>
          )}
          <IconButton sx={{ ml:2 }} onClick={(e)=>setAnchor(e.currentTarget)}>
            <Avatar>{userName ? userName[0].toUpperCase() : 'U'}</Avatar>
          </IconButton>
        </Box>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)}>
          <MenuItem>Profile</MenuItem>
          <MenuItem onClick={()=>{ localStorage.removeItem('id_token'); localStorage.removeItem('access_token'); localStorage.removeItem('user_name'); setUserName(null); setAnchor(null); }}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
