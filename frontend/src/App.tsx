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

  const leftPx = Math.floor((window.innerWidth - 20) * distribution);
  const rightPx = Math.floor((window.innerWidth - 20) * (1 - distribution));
  console.log(distribution, leftPx, rightPx);
  useEffect(() => {
    useStore.getState().calcGraphFromAtoms();
    useStore.getState().alignNodes();
  }, []);

  const { selectedNode } = useStore();
  return (
    <Layout>
      <main className={`grid`} style={{ gridTemplateColumns: `${leftPx}px 20px ${rightPx}px` }}>
        <section className="h-[calc(100vh-110px)] w-full">
          <Graph />
        </section>
        <section
          draggable={true}
          onClick={() => console.log("Clicked")}
          onDrag={(e) => {
            console.log("Dragging", e.clientX);
            setDistribution(distribution + e.clientX / window.innerWidth);
          }}
          className="bg-slate-300 hover:bg-slate-400 flex items-center  h-[calc(100vh-110px)]"
        >
          <Drag />
        </section>
        <section className="my-8 px-2 overflow-scroll overflow-x-hidden h-[calc(100vh-110px)]">
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
