import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import  ColumnView from './Column';


import { Box, Typography, Drawer,  Collapse,List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import logo from '../assets/logo.png';


const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Create login page', priority: 'High' },
    'task-2': { id: 'task-2', content: 'Design database schema', priority: 'Medium' },
    'task-3': { id: 'task-3', content: 'Setup API endpoints', priority: 'Low' },
    'task-4': { id: 'task-4', content: 'Implement authentication', priority: 'High' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-4'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

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

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && children}
    </div>
  );
}

function Board() {
  const [data, setData] = useState(initialData);
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(true);
  

  const [openMenus, setOpenMenus] = useState({});

  const handleClick = (text) => {
    setOpenMenus(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newState);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
    <Box sx={{ display: 'flex' }}>
    <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <img src={logo} alt="logo" />
          <List>
            {sidebarItems.map((item) => (
              <React.Fragment key={item.text}>
                <ListItem 
                  button 
                  onClick={() => handleClick(item.text)}
                  sx={{ 
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openMenus[item.text] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openMenus[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item?.subItems?.map((subItem) => (
                      <ListItem 
                        button 
                        key={subItem}
                        sx={{ 
                          pl: 4,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Categories Overview
      </Typography>
      <ColumnView />     
    </Box>
    </Box></>
    
  );
}

export default Board;