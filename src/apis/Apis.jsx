import React from "react";

export const handleSaveRows = async ({ exitEditingMode, row, values }) => {
  console.log(values.id);
  console.log(values.name);
  console.log(values.description);
  const response = await fetch(
    `${"http://127.0.0.1:8000/service/servicetype/"}${values.id}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: values.id,
        name: values.name,
        description: values.description,
      }),
    }
  );
  if (response.status === 200) {
    //replace this ersponse  with stickynote status
    return console.log(response.status);
  } else {
    return alert(response.status);
  }
  exitEditingMode();
};
