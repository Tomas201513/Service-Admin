import React from "react";
import { Outlet } from "react-router-dom";
import { ServiceTypes } from "./Servicetype/ServiceTypes";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CrudTable from "./Servicelist/CrudTable";
import Box from "@mui/material/Box";
function Services() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Service List" value="1" />
            <Tab label="Service Types" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <CrudTable />
        </TabPanel>
        <TabPanel value="2">
          <ServiceTypes />
        </TabPanel>
      </TabContext>
      <Outlet />
    </Box>
  );
}

export default Services;
