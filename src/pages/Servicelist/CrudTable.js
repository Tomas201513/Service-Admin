import { useQuery, useQueryClient, useMutation } from "react-query";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MaterialReactTable from "material-react-table";
// const axios = require("axios").default;
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DialogContentText from "@mui/material/DialogContentText";
import { SnackbarProvider, useSnackbar } from "notistack";

const CrudTable = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(false);
  const [rawSelection, setrawSelection] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const {
    isLoading: isLoading2,
    error: error2,
    data: data2,
  } = useQuery("repoData2", () =>
    fetch("http://127.0.0.1:8000/service/servicetype/").then(
      (res) => res.json(),
      { refetchInterval: 1000 }
    )
  );
  const { isLoading, error, data } = useQuery(
    "repoData",
    () =>
      fetch("http://127.0.0.1:8000/service/service/").then((res) => res.json()),
    { refetchInterval: 1000 }
  );
  // if (isLoading) return console.log(isLoading);

  // if (error) return "An error has occurred: " + error.message;
  // console.log(data2);
  const columns = [
    {
      header: "Id",
      accessorKey: "id",
      enableEditing: false,
    },
    {
      header: "Name",
      accessorKey: "name",
      enableClickToCopy: true,
      muiTableBodyCellEditTextFieldProps: {
        autoFocus: true,
      },

      // minSize: 10, //min size enforced during resizing
      // maxSize: 200, //max size enforced during resizing
      size: 100,
      // muiTableHeadCellProps: {
      //   align: "center",
      // },
      // muiTableBodyCellProps: {
      //   align: "center",
      // },
    },
    {
      header: "Description",
      accessorKey: "description",
      enableClickToCopy: true,
      minSize: 10, //min size enforced during resizing
      maxSize: 100, //max size enforced during resizing
      size: 100,
      muiTableBodyCellEditTextFieldProps: {
        autoFocus: true,
      },
    },
    {
      header: "Requirment",
      accessorKey: "requirment",
      enableClickToCopy: true,
      minSize: 10, //min size enforced during resizing
      maxSize: 200, //max size enforced during resizing
      size: 100,
      muiTableBodyCellEditTextFieldProps: {
        autoFocus: true,
      },
    },
    {
      header: "Service Type",
      accessorKey: "service_types.name",
      // accessorFn: (data2) => {
      //   // const x = data2.filter((d) => d.id === data2.service_types);
      //   return JSON.stringify(data2);
      // },
      editVariant: "select",
      enableClickToCopy: true,
      minSize: 10, //min size enforced during resizing
      maxSize: 300, //max size enforced during resizing
      size: 100,
      muiTableBodyCellEditTextFieldProps: {
        select: true, //change to select for a dropdown
        children: data2?.map((datas) => (
          <MenuItem key={datas} value={datas.id}>
            {datas.name}
          </MenuItem>
        )),
      },
    },
  ];
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

  const { mutate: handleCreateNewRow, isLoading: isCreating } = useMutation(
    (values) => axios?.post("http://127.0.0.1:8000/service/service/", values),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("service_types");
        enqueueSnackbar("New Service Created", {
          variant: "success",
        });
      },
      onError: (error) => {
        console.log(error);
        enqueueSnackbar("Unable to Create", {
          variant: "error",
        });
      },
    }
  );

  //exitEditingMode--used to cancil dialogebox
  //row--passes the position of the raw
  //values--pass the real data
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    console.log(`tommmmmmmm__ ${JSON.stringify(values.service_types)}`);
    const response = await fetch(
      `http://127.0.0.1:8000/service/service/${values.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: values.id,
          name: values.name,
          description: values.description,
          requirment: values.requirment,
          service_types: values.service_types,
        }),
      }
    );

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

  const handleDeleteRow = async (values, raw) => {
    // console.log(values.original.id);
    // setLoading(values.original.id);
    console.log(loading);
    const response = await fetch(
      `http://127.0.0.1:8000/service/service/${loading}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setOpen(false);

    if (response.status === 204) {
      //replace this ersponse  with stickynote status
      alert(response.status);
      console.log(`${response.status} deleted`);
    } else {
      alert(response.status);
      console.log("Try");
    }
  };
  const handleCancelRowEdits = () => {
    // setValidationErrors({});
  };

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
            enableEditing
            // editingMode="row"
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
                  Create New serviceType
                </Button>
                <Button
                  color="primary"
                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  onClick={handleExportData}
                  startIcon={<FileDownloadIcon />}
                  variant="text"
                >
                  Export All Data
                </Button>
                <Button
                  disabled={table.getPrePaginationRowModel().rows.length === 0}
                  //export all rows, including from the next page, (still respects filtering and sorting)
                  onClick={() =>
                    handleExportRows(table.getPrePaginationRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="text"
                >
                  Export All Rows
                </Button>
                <Button
                  disabled={table.getRowModel().rows.length === 0}
                  //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                  onClick={() => handleExportRows(table.getRowModel().rows)}
                  startIcon={<FileDownloadIcon />}
                  variant="text"
                >
                  Export Page Rows
                </Button>
                <Button
                  disabled={
                    !table.getIsSomeRowsSelected() &&
                    !table.getIsAllRowsSelected()
                  }
                  //only export selected rows
                  onClick={() =>
                    handleExportRows(table.getSelectedRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="text"
                >
                  Export Selected Rows
                </Button>
                <Button
                  onClick={() => {
                    setrawSelection(!rawSelection);
                  }}
                >
                  {rawSelection ? `${rawSelection}` : `${rawSelection}`}
                </Button>
              </Box>
            )}
          />
          <CreateNewAccountModal
            columns={columns}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
            data2={data2}
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
              <DialogContentText id="alert-dialog-description">
                {`${loading}`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelete}>Delete</Button>
              <Button onClick={handleClose} autoFocus>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
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

export default CrudTable;

const CreateNewAccountModal = ({ open, columns, onClose, onSubmit, data2 }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = (e) => {
    //put your validation logic here
    console.log(`suuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu`);

    console.log(values);
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            <TextField
              key={columns.name}
              label={columns.Name}
              name={columns.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              value={values.name}
              variant="outlined"
            />
            <TextField
              key={columns.requirment}
              label={columns.Requirment}
              name={columns.requirment}
              onChange={(e) =>
                setValues({ ...values, requirment: e.target.value })
              }
              value={values.requirment}
              variant="outlined"
            />
            <TextField
              key={columns.description}
              label={columns.Description}
              name={columns.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              value={values.description}
              variant="outlined"
            />

            <Select
              key={columns.service_types}
              label={columns.Service_Types}
              name={columns.service_types}
              onChange={(e) =>
                setValues({ ...values, service_types: e.target.value })
              }
              value={values.service_types}
              variant="outlined"
            >
              {data2?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Account
        </Button>
      </DialogActions>
    </Dialog>
  );
};
