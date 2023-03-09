import React from "react";
import { ButtonBase, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import logo from "../assets/insa.png";

function Logo() {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <ButtonBase disableRipple component={Link} to="/dashboard">
        <img src={logo} alt="Mantis" width="35" sx={{ mt: 1 }} />
        <Typography variant="h6" gutterBottom sx={{ ml: 1, mt: 2 }}>
          SERVICE
        </Typography>
      </ButtonBase>
    </Stack>
  );
}

export default Logo;
