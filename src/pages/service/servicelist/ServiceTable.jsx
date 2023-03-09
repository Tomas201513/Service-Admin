import { useMutation, useQuery, useQueryClient } from "react-query";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useReducer,
  useCallback,
} from "react";
import PrintIcon from "@mui/icons-material/Print";
// const axios = require("axios").default;
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import MaterialReactTable from "material-react-table";
import { Delete, Edit } from "@mui/icons-material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ServiceForm from "./ServiceForm";
import DialogContentText from "@mui/material/DialogContentText";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ServiceTable({ api }) {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  // console.log(rowSelection);
  // declare an array of objects to store the data
  const [data3, setData3] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const {
    isLoading: isLoading2,
    error: error2,
    data: data2,
  } = useQuery("repoData2", () =>
    fetch("http://127.0.0.1:8000/service/servicetype/").then(
      (res) => res.json()
      // { refetchInterval: 1000 }
    )
  );
  // console.log(data2);
  // console.log(typeof data2[0]);
  // console.log(data2[0].id);
  // declare an array
  // if (data2) {
  //   if (JSON.stringify(data2) !== JSON.stringify(data3)) {
  //     // for (let i = 0; i < data2.length; i++) {
  //       // data3.push({
  //       //   id: data2[i].id,
  //       // });
  //     }
  //     console.log(data3);
  //   }
  // }

  const columns = [
    {
      header: "Id",

      accessorKey: "id",
      enableEditing: false,
      enableClickToCopy: true,
      size: 50,
    },
    {
      header: "Name",
      // Header: <Typography style={{ color: "blue" }}>Name</Typography>, //arrow function
      accessorKey: "name",
      enableClickToCopy: true,
      minSize: 120, //min size enforced during resizing
      maxSize: 300, //max size enforced during resizing
      size: 150,

      // Footer: () => (
      //   <Stack>
      //     Max Age:
      //     <Box color="warning.main">{Math.round(maxAge)}</Box>
      //   </Stack>
      // ),
    },
    {
      header: "Description",
      accessorKey: "description",
      enableClickToCopy: true,
      minSize: 200, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 100, //medium column
    },
    {
      header: "Requirment",
      accessorKey: "requirment",
      enableClickToCopy: true,
      minSize: 200, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 100, //medium column
    },

    {
      header: "Service Type",
      accessorKey: "service_types.name",
      select: true,
      enableClickToCopy: true,
      minSize: 200, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 100, //medium column
      muiTableBodyCellEditTextFieldProps: {
        select: true, //change to select for a dropdown
        children: data2?.map((datas) => (
          <MenuItem key={datas.id} value={datas.id}>
            {datas.name}
          </MenuItem>
        )),
      },
    },
  ];
  const [deleteitems, setDeleteitems] = useState([]);
  const [deleteitemsdetail, setDeleteitemsdetail] = useState([]);
  const [showitems, setShowitems] = useState([]);

  const handleClickShow = (row) => {
    // console.log(row.original);
    // setShowitems(row.original);
    // setShowitems(Object.values(row.original));

    console.log(showitems);
    showitems?.push(
      row.original.id,
      row.original.name,
      row.original.description,
      row.original.requirment,
      row.original.service_types.name
    );

    setOpen(true);
  };

  const handleClickOpen = (row) => {
    // console.log(row.getValue("id"));
    // console.log(row.getValue("name"));
    deleteitems.push(row.getValue("id"));
    deleteitemsdetail.push(row.getValue("name"));
    console.log(deleteitems);
    console.log(deleteitemsdetail);

    // this is another way to get
    // setDeleteitems(Object.values(row.original)[0]);
    // setDeleteitemsdetail(Object.values(row.original)[1]);
    // console.log(Object.values(row.original));

    setOpen(true);
  };
  const handleClickOpenmulti = (row) => {
    setDeleteitems(row?.map((row) => row.getValue("id")));
    setDeleteitemsdetail(row?.map((row) => row.getValue("name")));
    console.log(row?.map((row) => row.getValue("name")));
    setOpen(true);
  };
  const handleClose = () => {
    setShowitems([]);
    setDeleteitems([]);
    setDeleteitemsdetail([]);
    setOpen(false);
    // console.log(showitems);
    // console.log(Object.values(deleteitems));
    // console.log(deleteitems);
  };

  const handleDelete = () => {
    // deleteRaw(deleteitems);
    console.log(JSON.stringify(deleteitems));
    deleteitems?.map(
      async (id, index) =>
        await axios.delete(`${api}${id}/`).then((response) => {
          if (response.status === 204) {
            //replace this ersponse  with stickynote status
            console.log(response.status);
            enqueueSnackbar(
              `Service Type ${deleteitemsdetail[index]} Deleted`,
              {
                variant: "success",
              },
              setRowSelection({})
            );
          } else {
            enqueueSnackbar(`UNABLE TO DELETE SERVICE TYPE`, {
              variant: "error",
            });
          }
        })
    );
    handleClose();
  };

  //exitEditingMode--used to cancil dialogebox
  //row--passes the position of the row
  //values--pass the real data
  // create a axios put request to the API and update
  const updateRaw = async ({ exitEditingMode, values, row }) => {
    console.log(values);
    axios
      .put(`${api}${values.id}/`, {
        name: values.name,
        description: values.description,
        requirment: values.requirment,
        service_types: values[`service_types.name`],
      })
      .then((response) => {
        if (response.status === 200) {
          //replace this ersponse  with stickynote status
          console.log(response.status);
          enqueueSnackbar(
            `Service Type ${values.name} Updated`,
            {
              variant: "success",
            },
            setRowSelection({})
          );
        } else {
          enqueueSnackbar(`UNABLE TO UPDATE SERVICE TYPE ${values.name}`, {
            variant: "error",
          });
        }
      })
      .catch((error) => {
        enqueueSnackbar(error.response.data.error, {
          variant: "error",
        });
      });
    handleClose();
    exitEditingMode();

    queryClient.invalidateQueries("service_types");
  };

  // create a useMutation hook to handle the POST request to the API and update the browser cache
  const { mutate: createNewRow, isLoading: isCreating } = useMutation(
    (values) => axios.post(api, values),
    {
      onSuccess: (values) => {
        queryClient.invalidateQueries("service_types");

        enqueueSnackbar(
          `Service Type ${JSON.stringify(values.data.name)} Created`,
          {
            variant: "success",
          }
        );
      },
      onError: (error) => {
        console.log(error.response.request.status);
        console.log(JSON.parse(error.response.request.responseText).name[0]);
        if (error.response.request.status === 400) {
          enqueueSnackbar(
            JSON.parse(error.response.request.responseText).name[0],
            {
              variant: "error",
            }
          );
        } else {
          enqueueSnackbar(error.response.data.error, {
            variant: "error",
          });
        }
      },
    }
  );

  // useQuery is a hook that takes a key, a function that will fetch the data, and an object with options. In this case, we are using the key "repoData" to identify the data fetch, and the function is a fetch to the API endpoint. The options object is setting the refetch interval to 1 second.

  const { isLoading, error, data } = useQuery(
    "repoData",
    () => fetch(`${api}`).then((res) => res.json()),
    {
      // Refetch the data every second
      refetchInterval: 1000,
    }
  );
  console.log(data);
  if (error) return "An error has occurred: " + error.message;
  if (isLoading) return console.log(isLoading);

  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns?.map((c) => c.header),
  };
  const csvExporter = new ExportToCsv(csvOptions);
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows?.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };
  const handleCancelRowEdits = () => {
    // setValidationErrors({});
  };
  return (
    <>
      {isLoading ? (
        <MaterialReactTable
          columns={columns}
          data={[]}
          state={{
            expanded: true,
            isLoading: isLoading,
          }}
        />
      ) : (
        <>
          <MaterialReactTable
            columns={columns}
            data={data}
            enableEditing={true}
            editingMode="modal"
            enableSorting={true}
            enableColumnOrdering
            onEditingRowSave={updateRaw}
            positionActionsColumn="last"
            enablePinning
            enableRowVirtualization
            enableStickyHeader
            enableStickyFooter
            positionToolbarAlertBanner="bottom"
            enableRowSelection
            state={{ rowSelection }}
            onRowSelectionChange={setRowSelection}
            enableRowNumbers
            rowNumberMode="original" //default
            muiTableProps={{
              sx: {
                tableLayout: "fixed",
              },
            }}
            initialState={{
              density: "compact",
              columnVisibility: { id: false },
              expanded: false, //expand all groups by default
              columnPinning: { left: ["id"] },
              pagination: { pageIndex: 0, pageSize: 15 },
              // sorting: [{ id: "name", desc: false }], //sort by state by default
            }}
            displayColumnDefOptions={{
              "mrt-row-actions": {
                header: "", //change header text
                size: 130, //make actions column wider
              },
            }}
            muiTableContainerProps={{
              sx: {
                maxHeight: 700,
                backgroundColor: "#e6f7ff",
                borderRadius: "10px",
                color: "primary",
              },
            }}
            muiTableBodyCellEditTextFieldProps={({ cell }) => ({
              onBlur: (event) => {
                console.info(event, cell.id);
              },
            })}
            muiSelectCheckboxProps={{
              color: "secondary", //makes all checkboxes use the secondary color
            }}
            muiTableHeadCellProps={{
              align: "left",
            }}
            muiTableBodyCellProps={{
              align: "left",
            }}
            renderRowActions={({ row, table }) =>
              !table.getIsSomeRowsSelected() &&
              !table.getIsAllRowsSelected() ? (
                <Box sx={{ display: "flex", gap: "rem", ml: "0.9rem" }}>
                  <Tooltip arrow placement="right" title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    arrow
                    placement="right"
                    title="Delete"
                    onClick={() => handleClickOpen(row)}
                  >
                    <IconButton>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    arrow
                    placement="right"
                    title="show"
                    onClick={() => handleClickShow(row)}
                  >
                    <IconButton>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <></>
              )
            }
            muiToolbarAlertBannerChipProps={{ color: "primary" }}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  p: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {!table.getIsSomeRowsSelected() &&
                !table.getIsAllRowsSelected() ? (
                  <Tooltip title="create service type">
                    <IconButton
                      color="primary"
                      onClick={() => setCreateModalOpen(true)}
                    >
                      <AddBoxIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="delete selected">
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        handleClickOpenmulti(table.getSelectedRowModel().rows);
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {!table.getIsSomeRowsSelected() &&
                !table.getIsAllRowsSelected() ? (
                  <Tooltip title="export csv">
                    <IconButton onClick={handleExportData}>
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="export selected rows">
                    <IconButton
                      color="secondary"
                      onClick={() =>
                        handleExportRows(table.getSelectedRowModel().rows)
                      }
                    >
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="print">
                  <IconButton
                    onClick={() => {
                      window.print();
                    }}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />
          <ServiceForm
            open={createModalOpen}
            columns={columns}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={createNewRow}
            data2={data2}
          />
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {!deleteitems.length
                ? ""
                : `${deleteitemsdetail.length} Service will be deleted`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <List>
                  {!deleteitems.length
                    ? showitems.map((item, index) => (
                        <ListItem key={item}>
                          ▸<Typography component={"span"}>{item}</Typography>{" "}
                        </ListItem>
                      ))
                    : deleteitemsdetail.map((item) => (
                        <ListItem key={deleteitems}>
                          ▸<Typography component={"span"}>{item}</Typography>{" "}
                        </ListItem>
                      ))}
                </List>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {!deleteitems.length ? (
                ""
              ) : (
                <Button onClick={handleDelete}>Delete</Button>
              )}
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
