import React from "react";
import { ServiceTypesCrud } from "../Table/ServiceTypesCrud";
function ServiceTypes() {
  const service_type_column = [
    {
      header: "Id",
      accessorKey: "id",
      enableEditing: false,
    },
    {
      header: "Name",
      accessorKey: "name",
      enableClickToCopy: true,
      minSize: 10, //min size enforced during resizing
      maxSize: 200, //max size enforced during resizing
      size: 100,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      enableClickToCopy: true,
      minSize: 10, //min size enforced during resizing
      maxSize: 200, //max size enforced during resizing
      size: 100,
    },
  ];

  const service_type_api = ["http://127.0.0.1:8000/service/servicetype/"];

  return (
    <ServiceTypesCrud columnss={service_type_column} api={service_type_api} />
  );
}

export default ServiceTypes;
