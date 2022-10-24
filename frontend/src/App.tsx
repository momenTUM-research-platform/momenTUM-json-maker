import toast, { Toaster } from "react-hot-toast";

import React from "react";
import QR from "qrcode";
import { Form } from "./Form";
import { Graph } from "./Graph";
import { Layout } from "./Layout";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1";

function App() {
  // useEffect(() => {
  //   if (!study || !studies) return;
  //   let schemaCopy = schema;
  //   schemaCopy.properties.modules.items.properties.condition.enum = [
  //     "Select one of the properties below",
  //     "*",
  //     ...study?.properties.conditions,
  //   ];
  //   const moduleIds = Array.from(new Set(study?.modules.map((module) => module.id)));

  //   schemaCopy.properties.modules.items.properties.unlock_after.items.enum =
  //     //    moduleIds.size > 0 ? Array.from(moduleIds) : [""];
  //     moduleIds.length > 0 ? moduleIds : [""];
  //   setSchema({ ...schemaCopy });
  // }, [study]);

  // useEffect(() => {
  //   fetch(API_URL + "/studies")
  //     .then((res) => res.json())
  //     .then((data) => setStudies(data))
  //     .catch((err) => toast.error("Download latest studies failed: " + String(err)));
  // }, []);

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
