import toast, { Toaster } from "react-hot-toast";

import React, { useEffect, useState } from "react";
import QR from "qrcode";
import { Form } from "./Form";
import { Graph } from "./Graph";
import { Layout } from "./Layout";
import { useStore } from "./state";
import Drag from "../assets/drag";

export const API_URL =
  process.env.NODE_ENV === "production" ? "/api/v1" : "http://localhost:8000/api/v1";

function App() {
  const [distribution, setDistribution] = useState(0.5);
  const { redraw } = useStore();
  const leftPx = Math.floor((window.innerWidth - 10) * distribution);
  const rightPx = Math.floor((window.innerWidth - 10) * (1 - distribution));
  useEffect(() => {
    redraw();
  }, []);

  const { selectedNode } = useStore();
  return (
    <Layout>
      <main className="w-full flex">
        <section className="h-[calc(100vh-110px)]" style={{ width: leftPx }}>
          <Graph />
        </section>
        <section
          draggable={true}
          onClick={() => console.log("Clicked")}
          onDrag={(e) => {
            e.preventDefault();
            setDistribution(e.clientX / window.innerWidth);
          }}
          className="bg-gray-200 hover:bg-gray-300 flex items-center cursor-col-resize  h-[calc(100vh-110px)]"
          style={{ width: 10 }}
        >
          <Drag />
        </section>
        <section
          className="my-8 px-2 overflow-scroll overflow-x-hidden h-[calc(100vh-110px)]"
          style={{ width: rightPx }}
        >
          {selectedNode ? (
            <Form id={selectedNode} />
          ) : (
            <div className="flex place-content-center h-full ">
              <p className="text-center self-center">Select node to start editing</p>
            </div>
          )}
        </section>

        <Toaster />
      </main>
    </Layout>
  );
}

export default App;
