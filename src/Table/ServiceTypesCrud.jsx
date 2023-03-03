import { useMutation, useQuery, useQueryClient } from "react-query";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MaterialReactTable from "material-react-table";
// const axios = require("axios").default;
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import AddIcon from "@mui/icons-material/Add";
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
import { Delete, Edit } from "@mui/icons-material";
import CreateNewAccountModal from "./CreateNewAccountModal";
import DeleteNewRawModal from "./DeleteNewRawModal";
import DialogContentText from "@mui/material/DialogContentText";
import { SnackbarProvider, useSnackbar } from "notistack";

export const ServiceTypesCrud = ({ columnss, api }) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState();
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
    headers: columns.map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const handleClickOpen = (row) => {
    setLoading(row.getValue("id"));
    console.log(row.getValue("id"));
    setOpen(true);
  };

  const handleClose = () => {
    setLoading("");
    setOpen(false);
  };
  const handleDelete = (loading) => {
    handleDeleteRow(loading);
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
    console.log(loading);
    const response = await fetch(`${api}${loading}/`, {
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
      enqueueSnackbar("unable Delete", {
        variant: "error",
      });
    }
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
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    csvExporter.generateCsv(data);
  };

  if (isLoading) return console.log(isLoading);

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <MaterialReactTable
        initialState={{ density: "compact" }}
        positionToolbarAlertBanner="bottom"
        enableRowSelection={rawSelection}
        // enableMultiRowSelection=
        muiTableBodyCellEditTextFieldProps={({ cell }) => ({
          onBlur: (event) => {
            console.info(event, cell.id);
          },
        })}
        enableRowVirtualization
        muiSelectCheckboxProps={{
          color: "secondary", //makes all checkboxes use the secondary color
        }}
        columns={columns}
        data={data}
        enableEditing={true}
        editingMode="modal"
        enableColumnOrdering
        onEditingRowSave={handleSaveRow}
        positionActionsColumn="last"
        muiTableProps={{
          sx: {
            tableLayout: "fixed",
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "rem" }}>
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
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => (
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              p: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <Button
              size="small"
              sx={{ size: "" }}
              color="primary"
              onClick={() => setCreateModalOpen(true)}
              variant="text"
            >
              <AddIcon /> Create
            </Button>
            <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              startIcon={<FileDownloadIcon />}
              variant="text"
            ></Button>

            <Button
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              //only export selected rows
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              startIcon={<FileDownloadIcon />}
              variant="text"
            >
              Export Selected Rows
            </Button>
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
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{`${loading}`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Delete</Button>
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
