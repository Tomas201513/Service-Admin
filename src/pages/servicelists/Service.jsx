import React from "react";
import { MenuItem } from "@mui/material";
import { useQuery } from "react-query";
import ServiceTable from "./ServiceTable";
export default function Service() {
  const service_type_api = ["http://127.0.0.1:8000/service/service/"];

  return <ServiceTable api={service_type_api} />;
}
