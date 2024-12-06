import React, { useState } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import epic from '../assets/epic.png';
import task from '../assets/subtask.png';
import { Dropdown } from 'primereact/dropdown';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
function ColumnView() {
  // State to hold expanded rows
  const [expandedRows, setExpandedRows] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editable, setEditable] = useState(false);
  // State to hold updated nodes (editable data)
  const [nodes, setNodes] = useState([
    {
      key: '0',
      data: {
        name: 'Applications',
        type: 'Folder',
        summary: 'Folder for apps',
        label: 'Applications',
        priority: 'High',
        assignee: 'John Doe',
        status: 'In Progress'
      },
      children: [
        {
          key: '0-0',
          data: {
            name: 'React',
            type: 'Folder',
            summary: 'React Framework apps',
            label: 'React',
            priority: 'Medium',
            assignee: 'John Doe',
            status: 'In Progress'
          },
          children: [
            {
              key: '0-0-0',
              data: {
                name: 'react.app',
                type: 'Application',
                summary: 'React Application',
                label: 'react.app',
                priority: 'High',
                assignee: 'John Doe',
                status: 'In Progress'
              }
            },
            {
              key: '0-0-1',
              data: {
                name: 'native.app',
                type: 'Application',
                summary: 'React Native Application',
                label: 'native.app',
                priority: 'Low',
                assignee: 'John Doe',
                status: 'In Progress'
              }
            },
            {
              key: '0-0-2',
              data: {
                name: 'mobile.app',
                type: 'Application',
                summary: 'Mobile Application',
                label: 'mobile.app',
                priority: 'Low',
                assignee: 'John Doe',
                status: 'In Progress'
              }
            }
          ]
        },
        {
          key: '0-1',
          data: {
            name: 'editor.app',
            type: 'Application',
            summary: 'Editor app',
            label: 'editor.app',
            priority: 'Medium',
            assignee: 'John Doe',
            status: 'In Progress'
          }
        },
        {
          key: '0-2',
          data: {
            name: 'settings.app',
            type: 'Application',
            summary: 'App settings',
            label: 'settings.app',
            priority: 'High',
            assignee: 'John Doe',
            status: 'In Progress'
          }
        }
      ]
    },
    {
      key: '1',
      data: {
        name: 'Cloud',
        type: 'Folder',
        summary: 'Cloud storage folder',
        label: 'Cloud',
        priority: 'Medium',
        assignee: 'John Doe',
        status: 'In Progress'
      },
      children: [
        {
          key: '1-0',
          data: {
            name: 'backup-1.zip',
            type: 'Zip',
            summary: 'Backup file 1',
            label: 'backup-1.zip',
            priority: 'Low',
            assignee: 'John Doe',
            status: 'In Progress'
          }
        },
        {
          key: '1-1',
          data: {
            name: 'backup-2.zip',
            type: 'Zip',
            summary: 'Backup file 2',
            label: 'backup-2.zip',
            priority: 'Low',
            assignee: 'John Doe',
            status: 'In Progress'
          }
        }
      ]
    }
    // Add other nodes similarly...
  ]);
  const statusOptions = [
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' },
    { label: 'Blocked', value: 'Blocked' }
  ];

  function redirect(){

  }

  const statusBodyTemplate = (nodeData) => {
    return (
      <Dropdown
        value={nodeData.data.status}
        options={statusOptions}
        onChange={(e) => {
          const updatedNodes = [...nodes];
          const updateNode = (items) => {
            for (let item of items) {
              if (item.key === nodeData.key) {
                item.data.status = e.value;
                return true;
              }
              if (item.children) {
                if (updateNode(item.children)) return true;
              }
            }
            return false;
          };
          updateNode(updatedNodes);
          setNodes(updatedNodes);
        }}
        className="p-inputtext-sm"
      />
    );
  };


  // Row toggle function to handle expanding and collapsing rows
  const onRowToggle = (e) => {
    setExpandedRows(e.value);
  };

  // Custom body template for the 'Name' column to include an icon
  const nameBodyTemplate = (nodeData) => {
    return (
      <>
        {nodeData.data.type === 'Folder' ? (
          <img src={epic} style={{ marginRight: '8px', color: '#0d6efd', height: '10px' }} />
        ) : (
          <img src={task} style={{ marginRight: '8px', color: '#6c757d', height: '10px' }} />
        )}
       
      </>
    );

  };

  const summaryBodyTemplate = (nodeData) => {
    return (

      <>{nodeData.data.summary}
      <ModeEditOutlineOutlinedIcon  style={{ marginLeft: '8px', color: '#0d6efd', height: '20px' }}
      onClick={()=>redirect()} /></>
      
    );
  };

  // Function to handle summary changes
  const onSummaryEditorValueChange = (e, node) => { 
    setEditable(true);
    const updatedNodes = [...nodes]; // Clone the existing nodes
    const updatedNode = updatedNodes.find(n => n.key === node.key);
    if (updatedNode) {
      updatedNode.data.summary = e.target.value; // Update the summary value
      setNodes(updatedNodes); // Set the updated state
    }
  };

  const getHeader = () => {
    return (
        <div className="flex">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText style={{display:"flex"}} type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search List" />
            </IconField>
        </div>
    );
};

let header = getHeader();

  return (
    <Box sx={{
      '& .p-treeTable': {
        width: '100%',
      },
      '.p-treetable .p-treetable-tbody > tr': {
        height: "10px !important",
      },
      '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        fontSize: '12px',
      },  
      '& th': {
        textAlign: 'center',
        padding: '16px',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        fontWeight: 500,
        color: 'rgba(0, 0, 0, 0.87)',
      },
    }}>
      <Paper elevation={3}>
       
        <TreeTable
          value={nodes}
          globalFilter={globalFilter}
          header={header} 
          expandedRows={expandedRows} // Bind expanded rows state
          onRowToggle={onRowToggle}    // Row toggle event to handle expand/collapse
        >
          <Column field="name" header="Type" filterPlaceholder="Filter by name" body={nameBodyTemplate} expander sortable />
          <Column field="type" header="#key" sortable />
          <Column field="type" header="Labels" sortable />
          
          {/* Editable Summary Column */}
          {editable? (<Column
            field="summary"
            header="Summary"
            sortable
            body={(nodeData) => (
              <input
                type="text"
                value={nodeData.data.summary}
                onChange={(e) => onSummaryEditorValueChange(e, nodeData)}
                style={{ width: '100%', padding: '5px' }}
              />
              
            ) }
           

          />):(
           <Column
            field="summary"
            header="Summary"
            body={summaryBodyTemplate}
           onClick={()=>setEditable(true)} />)}
           
          
          <Column field="priority" header="Priority"  filterPlaceholder="Filter by priority" sortable />
          <Column field="assignee" header="Assignee" sortable />
          <Column field="status" header="Status" sortable  body={statusBodyTemplate} />
        </TreeTable>
      </Paper>
    </Box>
  );
}

export default ColumnView;
