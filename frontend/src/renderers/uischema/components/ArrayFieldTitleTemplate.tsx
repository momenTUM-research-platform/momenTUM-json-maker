import React from "react";

interface ArrayFieldTitleProps {
  title: string;
  description?: string;
  idSchema: { $id: string };
}

function ArrayFieldTitleTemplate(props: ArrayFieldTitleProps) {
  const { title, description, idSchema } = props;
  const id = idSchema.$id;
  return <h1 id={id}>{title}</h1>;
}

export default ArrayFieldTitleTemplate;
