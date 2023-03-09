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
const CreateServiceForm = ({ open, columns, onClose, onSubmit, data2 }) => {
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
      <DialogTitle textAlign="center">Create New Department</DialogTitle>
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
              label="Name"
              name={columns.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              value={values.name}
              variant="outlined"
            />
            <TextField
              key={columns.description}
              label="Description"
              name={columns.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              value={values.description}
              variant="outlined"
            />
            <TextField
              key={columns.office_no}
              label="office_no"
              name={columns.office_no}
              onChange={(e) =>
                setValues({ ...values, office_no: e.target.value })
              }
              value={values.office_no}
              variant="outlined"
            />
            <TextField
              key={columns.phone_number}
              label="phone_number"
              name={columns.phone_number}
              onChange={(e) =>
                setValues({ ...values, phone_number: e.target.value })
              }
              value={values.phone_number}
              variant="outlined"
            />

            <Select
              key={columns.services}
              label="Service Types"
              name={columns.services}
              onChange={(e) =>
                setValues({ ...values, services: e.target.value })
              }
              value={values.services}
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceForm;
