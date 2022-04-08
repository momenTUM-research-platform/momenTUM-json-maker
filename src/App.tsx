import Form from "@rjsf/chakra-ui";
import schema from "../schema.json";
import { JSONSchema7 } from "json-schema";
import styled from "styled-components";
import "./App.css";

const Container = styled.div`
  margin: 100px;
`;

function App() {
  const uiSchema = {
    title: { "ui:widget": "hidden" },
  };

  return (
    <Container>
      <Form schema={schema as JSONSchema7} uiSchema={uiSchema} />
    </Container>
  );
}

export default App;
