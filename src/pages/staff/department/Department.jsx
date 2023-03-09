import React from "react";
import DepartmentTable from "./DepartmentTable";
export default function Department() {
  const department_api = ["http://127.0.0.1:8000/service/department/"];

  return <DepartmentTable api={department_api} />;
}
