import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Form } from "./renderers/Form";
import { Graph } from "./renderers/Graph";
import { Layout } from "./renderers/Layout";
import { useStore } from "./state";
import Drag from "../assets/drag";
import { Calendar } from "./renderers/Calendar";
import { Modal } from "./renderers/controllers/Modal";

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  console.log("Running in production mode");
} else {
  console.log("Running in development mode");
}

export const API_URL = isProduction ? "/api/v1" : "http://localhost:8000/api/v1";


function App() {
  const [distribution, setDistribution] = useState(0.5);
  const leftPx = Math.floor((window.innerWidth - 10) * distribution);
  const rightPx = Math.floor((window.innerWidth - 10) * (1 - distribution));
  const { selectedNode, setAtoms, mode } = useStore();
  useEffect(() => {
    // if (localStorage.getItem("atoms")) {
    //   const atoms: Atoms = new Map(JSON.parse(localStorage.getItem("atoms")!)); // Load previous state from local storage
    //   setAtoms(atoms);
    // }
  }, []);

  return (
    <Layout>
      <main className="w-full flex">

        {/* This is the react flow section */}
        <section className="h-[calc(100vh-110px)]" style={{ width: leftPx }}>
          {mode === "graph" ? <Graph /> : <Calendar />}
        </section>
        <section
          draggable={true}
          onDragEnd={(e) => {
            e.preventDefault();
            setDistribution(e.clientX / window.innerWidth);
          }}
          className="bg-gray-200 hover:bg-gray-300 flex items-center cursor-col-resize  h-[calc(100vh-110px)]"
          style={{ width: 10 }}
        >
          <Drag />
        </section>

        {/* This is the forms sections */}
        <section
          className="my-8 px-2 overflow-scroll overflow-x-hidden h-[calc(100vh-160px)]"
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
        <Modal />
      </main>
    </Layout>
  );
}

export default App;
