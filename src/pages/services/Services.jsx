import React from "react";
import { ServiceTable } from "./ServiceTypesTable";
export function ServiceTypes() {
  const service_type_column = [
    {
      header: "Id",

      accessorKey: "id",
      enableEditing: false,
      enableClickToCopy: true,
      size: 50,
    },
    {
      header: "Name",
      // Header: <Typography style={{ color: "blue" }}>Name</Typography>, //arrow function
      accessorKey: "name",
      enableClickToCopy: true,
      minSize: 120, //min size enforced during resizing
      maxSize: 300, //max size enforced during resizing
      size: 150,

      // Footer: () => (
      //   <Stack>
      //     Max Age:
      //     <Box color="warning.main">{Math.round(maxAge)}</Box>
      //   </Stack>
      // ),
    },
    {
      header: "Description",
      accessorKey: "description",
      enableClickToCopy: true,
      minSize: 200, //min size enforced during resizing
      maxSize: 400, //max size enforced during resizing
      size: 100, //medium column
    },
  ];

  const service_type_api = ["http://127.0.0.1:8000/service/servicetype/"];

  return <ServiceTable columnss={service_type_column} api={service_type_api} />;
}
