import React from "react";

interface ArrayFieldDescriptionProps {
  description: string;
  idSchema: { $id: string };
}

function ArrayFieldDescriptionTemplate(props: ArrayFieldDescriptionProps) {
  const { description, idSchema } = props;
  const id = idSchema.$id;
  return (
    <details id={id}>
      <summary>Description</summary>
      {description}
    </details>
  );
}

export default ArrayFieldDescriptionTemplate;
