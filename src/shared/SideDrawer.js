import React, { useState } from 'react';
import { Box, Typography, Drawer, Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';
import Tree from "../components/tree";

const sidebarItems = [
  { 
    text: 'Dashboard', 
    icon: <DashboardIcon />,
    subItems: ['Analytics', 'Reports', 'Overview']
  },
  { 
    text: 'Tasks', 
    icon: <AssignmentIcon />,
    subItems: ['All Tasks', 'My Tasks', 'Completed']
  },
  { 
    text: 'Team', 
    icon: <PeopleIcon />,
    subItems: ['Members', 'Groups', 'Permissions']
  },
  { 
    text: 'Settings', 
    icon: <SettingsIcon />,
    subItems: ['Profile', 'Preferences', 'Security']
  },
];

function SideDrawer() {
  const customizer = useSelector((state) => state.customizer);
  const [openMenus, setOpenMenus] = useState({});

  const handleClick = (text) => {
    setOpenMenus(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer */}
      <Drawer
        variant="permanent"
        anchor="left"
        open
        PaperProps={{
          sx: {
            width: customizer.SidebarWidth, // Customizable width
            backgroundColor: customizer.activeMode === 'dark' ? customizer.darkBackground900 : customizer.activeSidebarBg,
            color: customizer.activeSidebarBg === '#ffffff' ? '' : 'black',
            border: '0 !important',
            boxShadow: (theme) => theme.shadows[8],
            height: '100%', // Ensure it spans full height
            position: 'relative', // Ensure correct stacking context
          },
        }}
      >
        <Box sx={{ backgroundColor: customizer.activeMode === 'dark' ? customizer.darkBackground900 : customizer.activeSidebarBg, height: '100%' }}>
          <Box px={3}>
            <img src={logo} alt="logo" />
          </Box>
          <List>
            {sidebarItems.map((item) => (
              <React.Fragment key={item.text}>
                <ListItem button onClick={() => handleClick(item.text)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem button key={subItem} sx={{ pl: 4 }}>
                        <ListItemText primary={subItem} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Typography variant="h4" gutterBottom>
          Education List
        </Typography>
        <Tree />
      </Box>
    </Box>
  );
}

export default SideDrawer;
