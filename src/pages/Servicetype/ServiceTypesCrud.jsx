import { useMutation, useQuery, useQueryClient } from "react-query";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import MaterialReactTable from "material-react-table";
// const axios = require("axios").default;
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import AddIcon from "@mui/icons-material/Add";
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
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, MultilineChart } from "@mui/icons-material";
import CreateNewAccountModal from "./CreateNewAccountModal";
import DialogContentText from "@mui/material/DialogContentText";
import { SnackbarProvider, useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const ServiceTypesCrud = ({ columnss, api }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [multidelitems, setMultidelitems] = useState([]);
  const [loading, setLoading] = useState();
  const [deleteitems, setDeleteitems] = useState([]);
  const [showitems, setShowitems] = useState();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [rawSelection, setrawSelection] = useState(false);
  const columns = columnss;
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

  const handleClickShow = (raw) => {
    setShowitems(Object.values(raw.original));
    console.log(raw.original);
    setOpen(true);
  };

  const handleClickOpen = (row) => {
    setDeleteitems(row.getValue("id"));
    console.log(row.getValue("id"));
    setOpen(true);
  };
  const handleClickOpenmulti = (row) => {
    setDeleteitems(row?.map((row) => row.getValue("id")));
    console.log(row?.map((row) => row.getValue("id")));
    setOpen(true);
  };
  const handleClose = () => {
    setDeleteitems("");
    setOpen(false);
    setShowitems("");
  };
  const handleDelete = (deleteitems) => {
    handleDeleteRow(deleteitems);
  };
  // create a useMutation hook to handle the POST request to the API and update the browser cache
  const { mutate: createNewRow, isLoading: isCreating } = useMutation(
    (values) => axios.post(api, values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("service_types");
        enqueueSnackbar("Service Type Updated", {
          variant: "success",
        });
      },
      onError: (error) => {
        console.log(error);
        enqueueSnackbar("Service Type Updated", {
          variant: "error",
        });
      },
    }
  );

  //exitEditingMode--used to cancil dialogebox
  //row--passes the position of the raw
  //values--pass the real data
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    console.log(values.id);
    console.log(values.name);
    console.log(values.description);
    const response = await fetch(`${api}${values.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: values.id,
        name: values.name,
        description: values.description,
      }),
    });
    if (response.status === 200) {
      //replace this ersponse  with stickynote status
      console.log(response.status);
      enqueueSnackbar("Service Type Updated", {
        variant: "success",
      });
    } else {
      alert(response.status);
    }
    exitEditingMode();
  };
  // create a function that update local state when the user edits a cell

  const handleDeleteRow = async (values, raw) => {
    // console.log(values.original.id);
    // setLoading(values.original.id);
    console.log(deleteitems);
    deleteitems?.map(async (id) => {
      const response = await fetch(`${api}${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 204) {
        //replace this ersponse  with stickynote status
        console.log(response.status);
        enqueueSnackbar("Service Type Deleted", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(`unable to delete ${id}`, {
          variant: "error",
        });
      }
    });
    handleClose();
  };

  const handleCancelRowEdits = () => {
    // setValidationErrors({});
  };
  const { isLoading, error, data } = useQuery(
    "repoData",
    () => fetch(`${api}`).then((res) => res.json()),
    {
      // Refetch the data every second
      refetchInterval: 1000,
    }
  );
  if (isLoading) return console.log(isLoading);

  if (error) return "An error has occurred: " + error.message;

  //   useEffect(() => {
  //     // getApiData();
  //   }, []);

  //should be memoized or stable
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows?.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  if (isLoading) return console.log(isLoading);

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <MaterialReactTable
        // enableColumnResizing

        enablePinning
        enableRowVirtualization
        enableGrouping
        enableStickyHeader
        enableStickyFooter
        initialState={{
          density: "compact",
          columnVisibility: { id: false },
          expanded: false, //expand all groups by default
          columnPinning: { left: ["id"] },
          // pagination: { pageIndex: 0, pageSize: 20 },
          // sorting: [{ id: "name", desc: false }], //sort by state by default
        }}
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "", //change header text
            size: 120, //make actions column wider
          },
        }}
        muiToolbarAlertBannerChipProps={{ color: "primary" }}
        muiTableContainerProps={{
          sx: {
            maxHeight: 700,
            backgroundColor: "#e6f7ff",
            borderRadius: "10px",
            color: "primary",
          },
        }}
        positionToolbarAlertBanner="bottom"
        enableRowSelection
        enableRowNumbers
        rowNumberMode="original" //default
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
        columns={columns}
        data={data}
        enableEditing={true}
        editingMode="modal"
        enableSorting={true}
        enableColumnOrdering
        onEditingRowSave={handleSaveRow}
        positionActionsColumn="last"
        muiTableProps={{
          sx: {
            tableLayout: "fixed",
          },
        }}
        renderRowActions={({ row, table }) =>
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() ? (
            <Box sx={{ display: "flex", gap: "rem", ml: "1rem" }}>
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
                <Button
                  color="primary"
                  onClick={() => setCreateModalOpen(true)}
                  variant="text"
                  startIcon={<AddIcon />}
                  size="large"
                />
              </Tooltip>
            ) : (
              <Tooltip title="delete selected">
                <Button
                  color="secondary"
                  onClick={() => {
                    handleClickOpenmulti(table.getSelectedRowModel().rows);
                  }}
                  startIcon={<DeleteForeverIcon />}
                  variant="text"
                  sx={{ fontSize: "small" }}
                />
              </Tooltip>
            )}

            {!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() ? (
              <Tooltip title="export csv">
                <Button
                  color="primary"
                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  onClick={handleExportData}
                  startIcon={<FileDownloadIcon />}
                  variant="text"
                  sx={{ fontSize: "small" }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="export selected raws">
                <Button
                  // disabled={
                  //   !table.getIsSomeRowsSelected() &&
                  //   !table.getIsAllRowsSelected()
                  // }
                  //only export selected rows
                  onClick={() =>
                    handleExportRows(table.getSelectedRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="text"
                  color="secondary"
                  sx={{ fontSize: "small" }}
                />
              </Tooltip>
            )}
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
          {showitems ? "" : " Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${deleteitems}` +
              `${showitems[0]} '\t' ${showitems[1]} +'\n'+ ${showitems[2]}`}
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

// const validateRequired = (value) => !!value.length;
// const validateEmail = (email) =>
//   !!email.length &&
//   email
//     .toLowerCase()
//     .match(
//       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//     );
// const validateAge = (age) => age >= 18 && age <= 50;
