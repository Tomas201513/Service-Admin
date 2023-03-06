import { useQuery } from "react-query";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import MaterialReactTable from "material-react-table";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
  Select,
  TextField,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";

//example of creating a mui dialog modal for creating new rows
const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
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

            <TextareaAutosize
              minRows={5}
              key={columns.description}
              label={columns.Description}
              name={columns.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              value={values.description}
              variant="outlined"
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewAccountModal;
