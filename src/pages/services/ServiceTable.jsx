import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useReducer,
  useCallback,
} from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Delete, Edit, MultilineChart } from "@mui/icons-material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import DialogContentText from "@mui/material/DialogContentText";
import MaterialReactTable from "material-react-table";
import { ExportToCsv } from "export-to-csv";
import { SnackbarProvider, useSnackbar } from "notistack";
import CreateNewAccountModal from "./CreateServiceForm";

export const ServiceTypesCrud = ({ columnss, api }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  // console.log(rowSelection);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const columns = columnss;

  const [deleteitems, setDeleteitems] = useState([]);
  const [deleteitemsdetail, setDeleteitemsdetail] = useState([]);
  const [showitems, setShowitems] = useState();
  const handleClickShow = (row) => {
    setShowitems(Object.values(row.original));
    console.log(Object.values(row.original));
    setOpen(true);
  };

  const handleClickOpen = (row) => {
    deleteitems.push(row.getValue("id"));
    deleteitemsdetail.push(row.getValue("name"));
    console.log(row.getValue("id"));
    console.log(row.getValue("name"));

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
    setDeleteitems([]);
    setShowitems("");
    setDeleteitemsdetail([]);
    setOpen(false);
  };
  const handleDelete = (deleteitems) => {
    deleteRaw(deleteitems);
  };
  const deleteRaw = async (values, row) => {
    // console.log(values.original.id);
    // setLoading(values.original.id);
    console.log(deleteitems);
    // console.log(deleteitemsdetail);
    deleteitems.map(async (id, index) => {
      axios
        .delete(`${api}${id}/`)
        .then((response) => {
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
            enqueueSnackbar(
              `UNABLE TO DELETE SERVICE TYPE ${deleteitemsdetail[index]}`,
              {
                variant: "error",
              }
            );
          }
        })
        .catch((error) => {
          enqueueSnackbar(error.response.data.error, {
            variant: "error",
          });
        });
    });
    handleClose();
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

  //exitEditingMode--used to cancil dialogebox
  //row--passes the position of the row
  //values--pass the real data
  const updateRaw = async ({ exitEditingMode, row, values }) => {
    // console.log(values.id);
    // console.log(values.name);
    // console.log(values.description);
    try {
      const response = await axios.put(`${api}${values.id}/`, values);
      if (response.status === 200) {
        //replace this ersponse  with stickynote status
        console.log(response.status);
        enqueueSnackbar(`Service Type "${values.name}" Updated`, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(`Unable to update "${values.name}"`, {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.error, {
        variant: "error",
      });
    }
    exitEditingMode();
    queryClient.invalidateQueries("service_types");
  };

  // useQuery is a hook that takes a key, a function that will fetch the data, and an object with options. In this case, we are using the key "repoData" to identify the data fetch, and the function is a fetch to the API endpoint. The options object is setting the refetch interval to 1 second.

  const { isLoading, error, data } = useQuery(
    "repoData",
    () => fetch(`${api}`).then((res) => res.json()),
    {
      // Refetch the data every second
      refetchInterval: 1000,
    }
  );
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

  return (
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
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() ? (
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
            {!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() ? (
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

            {!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() ? (
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
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={createNewRow}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {showitems
            ? ""
            : `${deleteitemsdetail.length} Service types will be deleted`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <List>
              {showitems
                ? showitems?.map((item) => <ListItem>{item}</ListItem>)
                : deleteitemsdetail.map((item) => (
                    <ListItem>▸ {item}</ListItem>
                  ))}
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {showitems ? "" : <Button onClick={handleDelete}>Delete</Button>}
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
