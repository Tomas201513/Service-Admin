// import React from "react";
// import { ServiceCrud } from "./ServiceCrud";
// import { MenuItem } from "@mui/material/MenuItem";
// function ServiceList() {
//   const service_list_column = [
//     {
//       header: "Id",
//       accessorKey: "id",
//       enableEditing: false,
//     },
//     {
//       header: "Name",
//       accessorKey: "name",
//       enableClickToCopy: true,
//       minSize: 10, //min size enforced during resizing
//       maxSize: 200, //max size enforced during resizing
//       size: 100,
//       muiTableHeadCellProps: {
//         align: "center",
//       },
//       muiTableBodyCellProps: {
//         align: "center",
//       },
//     },
//     {
//       header: "Description",
//       accessorKey: "description",
//       enableClickToCopy: true,
//       minSize: 10, //min size enforced during resizing
//       maxSize: 200, //max size enforced during resizing
//       size: 100,
//     },
//     {
//       header: "Requirment",
//       accessorKey: "requirment",
//       enableClickToCopy: true,
//       minSize: 10, //min size enforced during resizing

//       maxSize: 200, //max size enforced during resizing

//       size: 100,
//     },
//     {
//       header: "Service Type",
//       accessorKey: "service_type",
//       enableClickToCopy: true,
//       minSize: 10, //min size enforced during resizing
//       maxSize: 200, //max size enforced during resizing
//       size: 100,
//       muiTableBodyCellEditTextFieldProps: {
//         select: true, //change to select for a dropdown
//         children: data.map((datas) => (
//           <MenuItem key={datas} value={datas}>
//             {datas}
//           </MenuItem>
//         )),
//       },
//     },
//   ];

//   const service_list_api = ["http://127.0.0.1:8000/service/service/"];
//   return <ServiceCrud columnss={service_list_column} api={service_list_api} />;
// }

// export default ServiceList;
