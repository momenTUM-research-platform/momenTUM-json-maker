import { useEffect, useState } from "react";
import { Study } from "../types";
import toast, { Toaster } from "react-hot-toast";
import {
  addApiKey,
  download,
  generateDictionary,
  load,
  save,
  upload,
  validate,
} from "./utils/actions";
import "./App.css";
import React from "react";
import QR from "qrcode";
import { schema as Schema } from "../schema/schema";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1";

function App() {
  const [study, setStudy] = useState<Study | null>(null);
  const [schema, setSchema] = useState(Schema);
  const [studies, setStudies] = useState<{ [key: string]: Study } | null>(null);

  useEffect(() => {
    if (!study || !studies) return;
    let schemaCopy = schema;
    schemaCopy.properties.modules.items.properties.condition.enum = [
      "Select one of the properties below",
      "*",
      ...study?.properties.conditions,
    ];
    const moduleIds = Array.from(new Set(study?.modules.map((module) => module.id)));

    schemaCopy.properties.modules.items.properties.unlock_after.items.enum =
      //    moduleIds.size > 0 ? Array.from(moduleIds) : [""];
      moduleIds.length > 0 ? moduleIds : [""];
    setSchema({ ...schemaCopy });
  }, [study]);

  useEffect(() => {
    fetch(API_URL + "/studies")
      .then((res) => res.json())
      .then((data) => setStudies(data))
      .catch((err) => toast.error("Download latest studies failed: " + String(err)));
  }, []);

  return (
    <main className="grid grid-cols-2">
      <section></section>
      <section>
        <Toaster />
      </section>
    </main>
  );
}

export default App;
