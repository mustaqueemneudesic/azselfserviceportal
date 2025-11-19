import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';

const menu = [
  {text:'Home', icon:<HomeIcon/>},
  {text:'Projects', icon:<FolderIcon/>},
  {text:'Recommendation', icon:<FolderIcon/>},
  {text:'AWS Project', icon:<FolderIcon/>},
  {text:'CIDR', icon:<FolderIcon/>},
  {text:'ELK', icon:<FolderIcon/>},
  {text:'Templates', icon:<FolderIcon/>},
  {text:'Logs', icon:<FolderIcon/>},
  {text:'IAM', icon:<FolderIcon/>},
  {text:'Reports', icon:<FolderIcon/>},
  {text:'Settings', icon:<SettingsIcon/>}
];

export default function Sidebar(){
  return (
    <Drawer variant="permanent" sx={{ width:240, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' } }}>
      <Toolbar />
      <List>
        {menu.map((m)=> (
          <ListItemButton key={m.text}>
            <ListItemIcon>{m.icon}</ListItemIcon>
            <ListItemText primary={m.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
