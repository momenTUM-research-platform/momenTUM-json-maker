import toast, { Toaster } from "react-hot-toast";

import React from "react";
import QR from "qrcode";
import { Form } from "./Form";
import { Graph } from "./Graph";
import { Layout } from "./Layout";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1";

function App() {
  return (
    <Layout>
      <main className="grid grid-cols-2 grid-col">
        <section className="h-[calc(100vh-110px)] w-full">
          <Graph />
        </section>
        <section className="m-8 overflow-scroll h-[calc(100vh-140px)]">
          <Form />
        </section>
        <Toaster />
      </main>
    </Layout>
  );
}

export default App;
