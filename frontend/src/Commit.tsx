import React from "react";
import styled from "styled-components";
import { Form } from "../types";
import { download } from "./tools";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Commit({
  setForm,
  id,
  hash,
  timestamp,
}: {
  setForm: (form: Form) => void;
  id: string;
  hash: string;
  timestamp: number;
}) {
  return (
    <Button onClick={() => download(setForm, id, hash)}>
      <p style={{ margin: 4 }}>{dayjs(timestamp).fromNow()}</p>
      <p style={{ fontSize: 14, margin: 2 }}>{hash.slice(0, 7)}</p>
    </Button>
  );
}

const Button = styled.button`
  padding: 4px 8px 4px 8px;
  background: #ce1d81;
  color: white;
  border-radius: 5px;
  margin-right: 7px;
  margin-top: 3px;
  font-size: 1em;
  box-shadow: none;
  border: none;
  text-decoration: none;
`;
