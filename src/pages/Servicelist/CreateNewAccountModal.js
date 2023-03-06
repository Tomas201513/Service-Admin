import { useQuery } from "react-query";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MaterialReactTable from "material-react-table";
// const axios = require("axios").default;
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

//example of creating a mui dialog modal for creating new rows
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
              {data2.map((item) => (
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

export default CreateNewAccountModal;
