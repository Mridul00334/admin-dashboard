
import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Typography,
  TableHead,
  Chip,
  Box,
  AvatarGroup, Grid
} from '@mui/material';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Stack } from '@mui/system';
import epic from '../assets/epic.png';
import { Checkbox } from 'primereact/checkbox';
import DownloadCard from '../shared/DownloadCard';
import task from '../assets/subtask.png';
import { Dropdown } from 'primereact/dropdown';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { getList } from "../api/index";
import "./tree.css"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { KeyboardReturnOutlined, MedicalInformationOutlined } from '@mui/icons-material';
import Spinner from '../shared/Spinner/Spinner';




const columnHelper = createColumnHelper();



// [
//   {
//     key: '0',
//     data: {
//       name: 'Applications',
//       type: 'Folder',
//       summary: 'Folder for apps',
//       label: 'Applications',
//       priority: 'High',
//       assignee: 'John Doe',
//       status: 'In Progress'
//     },
//     children: [
//       {
//         key: '0-0',
//         data: {
//           name: 'React',
//           type: 'Folder',
//           summary: 'React Framework apps',
//           label: 'React',
//           priority: 'Medium',
//           assignee: 'John Doe',
//           status: 'In Progress'
//         },
//         children: [
//           {
//             key: '0-0-0',
//             data: {
//               name: 'react.app',
//               type: 'Application',
//               summary: 'React Application',
//               label: 'react.app',
//               priority: 'High',
//               assignee: 'John Doe',
//               status: 'In Progress'
//             }
//           },
//           {
//             key: '0-0-1',
//             data: {
//               name: 'native.app',
//               type: 'Application',
//               summary: 'React Native Application',
//               label: 'native.app',
//               priority: 'Low',
//               assignee: 'John Doe',
//               status: 'In Progress'
//             }
//           },
//           {
//             key: '0-0-2',
//             data: {
//               name: 'mobile.app',
//               type: 'Application',
//               summary: 'Mobile Application',
//               label: 'mobile.app',
//               priority: 'Low',
//               assignee: 'John Doe',
//               status: 'In Progress'
//             }
//           }
//         ]
//       },
//       {
//         key: '0-1',
//         data: {
//           name: 'editor.app',
//           type: 'Application',
//           summary: 'Editor app',
//           label: 'editor.app',
//           priority: 'Medium',
//           assignee: 'John Doe',
//           status: 'In Progress'
//         }
//       },
//       {
//         key: '0-2',
//         data: {
//           name: 'settings.app',
//           type: 'Application',
//           summary: 'App settings',
//           label: 'settings.app',
//           priority: 'High',
//           assignee: 'John Doe',
//           status: 'In Progress'
//         }
//       }
//     ]
//   },
//   {
//     key: '1',
//     data: {
//       name: 'Cloud',
//       type: 'Folder',
//       summary: 'Cloud storage folder',
//       label: 'Cloud',
//       priority: 'Medium',
//       assignee: 'John Doe',
//       status: 'In Progress'
//     },
//     children: [
//       {
//         key: '1-0',
//         data: {
//           name: 'backup-1.zip',
//           type: 'Zip',
//           summary: 'Backup file 1',
//           label: 'backup-1.zip',
//           priority: 'Low',
//           assignee: 'John Doe',
//           status: 'In Progress'
//         }
//       },
//       {
//         key: '1-1',
//         data: {
//           name: 'backup-2.zip',
//           type: 'Zip',
//           summary: 'Backup file 2',
//           label: 'backup-2.zip',
//           priority: 'Low',
//           assignee: 'John Doe',
//           status: 'In Progress'
//         }
//       }
//     ]
//   }
//   // Add other nodes similarly...
// ]

const ReactBasicTable = () => {
  const [expandedRows, setExpandedRows] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editable, setEditable] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  const [selectedItems,setSelectedItems]=useState([]);
  const [isLoading,setIsLoading]=useState(false);

  const formatKey = (key) => {
    // A dictionary for specific keys to provide custom formatting
    const customKeys = {
      _id: 'ID',
      Section_ID: 'Section',
      restrictCountry: 'Restrict Country',
      createdBy: 'Created By',
      mediaURL: 'Media URL',
      isEnabled: 'Enabled',
      impressionTag: 'Impression Tag',
      FireBase_Remote_Config: 'Firebase Remote Config',
      Keywords: 'Keywords',
      views: 'Views',
      orders: 'Orders',
      priority: 'Priority',
      subTitle: 'Sub Title',
      description: 'Description',
      title: 'Title',
      Flag: 'Flag',
      isVideo: 'Is Video'
    };
  
    // If the key exists in the customKeys dictionary, return the formatted name
    if (customKeys[key]) {
      return customKeys[key];
    }
  
    // Otherwise, remove underscores, split the string into words, capitalize each word, and join them with spaces
    return key
      .replace(/_/g, ' ')               // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize first letter of each word
  };

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      let data = await getList();
      const transformData = (data, parentKey = 0) => {
        return data.map((item, index) => {
            const currentKey = parentKey; // Create key for the current item
    
            // Spread informationDetails and analyticsDetails into the same object
           let {informationDetails ,analyticsDetails,children,Information_ID,Analytics_ID,...res}=item
            const transformedItem = {
                key: currentKey.toString(), // Add the current key
                data:{...res,
                ...informationDetails,
                ...analyticsDetails
                },
                children: item.children ? transformData(item.children, `${currentKey}-${index}`) : []
                 // Recursively handle children with updated parent key
            };
    
            // Clean up the now unnecessary informationDetails and analyticsDetails
            delete transformedItem.data.informationDetails;
            delete transformedItem.data.analyticsDetails;
            delete transformedItem.data.Information_ID;
            delete transformedItem.data.Analytics_ID;
    
            return transformedItem;
        });
    };
    let finalArr = transformData(data);
    
    const akey = new Set();
    finalArr.forEach((node) => {
         Object.keys(node.data).forEach((key) => (key !== "key" || key!=="children") && akey.add(key));
       });
       const selectedKeys = Array.from(akey).slice(0, 4);
       const newItems = selectedKeys.map((key) => ({ name: key, code: key }));  // Assuming `name` is `key` and `code` is also `key`
    
    setSelectedItems(Array.from(akey));  // Set the initial list of items with `name` and `code`
    setAllKeys(selectedKeys);    // Set the initial selected keys
    setNodes(finalArr)
    console.log(Array.from(akey))
    setIsLoading(false)
    };
  

    
    getData()

  }, []);

  function redirect() {

  }
  const statusOptions = [
    { label: 'To Do', value: 'To Do' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Done', value: 'Done' },
    { label: 'Blocked', value: 'Blocked' }
  ];

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
        <ModeEditOutlineOutlinedIcon style={{ marginLeft: '8px', color: '#0d6efd', height: '20px' }}
          onClick={() => redirect()} /></>

    );
  };

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
      <div className="flex" style={{justifyContent:"space-between"}} >
      <div className="flex">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText className="search-input" style={{ display: "flex" }} type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search List" />
        </IconField>
        
      </div>
      <div className="card flex justify-content-center" style={{margin:"0px 30px",zIndex:"100",background:"white"}}>
      <MultiSelect value={allKeys} onChange={(e) => handleCheck(e.value)} options={selectedItems} 
          placeholder="Select Column" maxSelectedLabels={3} className="w-full md:w-20rem"
          panelStyle={{
            backgroundColor: 'white', // Makes the dropdown background transparent
          }} />
  </div>
  </div>
    );
  };

  let header = getHeader();


  
  const handleCheck = (val) => {
    // Remove codes that are not selected anymore and add new selected codes
  // Directly assign selected codes to `updatedAllKeys`
    
    // Update `allKeys` with the selected items
    if(val===null || val.length===0){
      return;
    }
    setAllKeys(val)
  
    // Update `selectedItems` by mapping the `selectedCodes` to the corresponding objects
      // Update selected items
  };
  
  

  const handleDownload = () => {
    
  };

  return (
    <DownloadCard title="Basic Table" onDownload={handleDownload}>
      {isLoading && <Spinner/>}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{
            '& .p-treeTable': {
              width: '100%',
            },
            '.p-treetable .p-treetable-tbody > tr': {
              height: "40px !important",
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              fontSize: '13px',
              textAlign: "center",
            },
            'button': {
              height: "10px",
              marginRight: "10px"
            },
            '& th': {
              textAlign: 'center',
              padding: '16px',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              fontWeight: 500,
              color: 'rgba(0, 0, 0, 0.87)',
              width: "auto",
              maxWidth:"30px",
              overflow: "hidden"
            },
          }}>
            <div className="flex align-items-center" style={{flexWrap:"wrap",margin:"30px"}}>


            </div>
                
            <TreeTable
              value={nodes}
              globalFilter={globalFilter}
              header={header}
              expandedRows={expandedRows} // Bind expanded rows state
              onRowToggle={onRowToggle} // Row toggle event to handle expand/collapse
            >
              {allKeys && allKeys.length > 0 && allKeys.map((key) => (

                <Column
                  // Use key in the Column for efficient rendering
                  field={key} // Use the key as the field
                  header={formatKey(key)} // Use the key as the header
                  filterPlaceholder={`Filter by ${key}`} // Use key in filter placeholder
                  
                  body={(rowData) => {
                    // Check if the field is an object, and handle it accordingly
                    if(key ==="_id"){
                      return <img src={epic} style={{height:"14px",weight:"10px"}}/>
                    }
                    if (typeof rowData.data[key] === 'object' && rowData.data[key] !== null) {
                      // For 'createdBy', render firstName and lastName
                      if (key === 'createdBy') {
                        return `${rowData.data[key].firstName} ${rowData.data[key].lastName}`;
                      }
                     
                      if (key === 'FireBase_Remote_Config') {
                        return `${rowData.data[key].featureEnabled}`;
                      }
                      if(key=="Keywords"){
                        return rowData.data[key].join(",")
                      }
                      if(key ==="impressionTag"){
                        return  `${rowData.data[key].ID - rowData.data[key].NAME}`
                      }

                      // For any other object fields, you could decide to show a JSON string or handle differently
                      return JSON.stringify(rowData.data[key]); // Or customize how you want to display the object
                    }
                    // Otherwise, just return the value directly
                    if (key === 'key') {
                      return;
                    }
                    return rowData.data[key];
                  }}
                  // Adjust for expandability if needed
                  expander={key==="_id"}
                  sortable // Enable sorting
                />
              ))}
            </TreeTable>
            



          </Box>
        </Grid>
      </Grid>
    </DownloadCard>

  );
};

export default ReactBasicTable;
