import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Link from "@mui/material/Link";
import fof from "../assets/fof.png";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const Error404 = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Grid>
        <Grid item xs={12}>
          <img src={fof} alt="404" width={300} height={300} />
        </Grid>
        <Grid item xs={12}>
          {/* <Link
            sx={{ alignItems: "center", justifyContent: "center" }}
            onClick={goBack}
            variant="body2"
          >
            {"Back Home"}
          </Link> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Error404;
