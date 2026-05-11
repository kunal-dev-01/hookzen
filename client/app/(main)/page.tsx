"use client";

import { toast } from "sonner";

const click = () => toast.success("Success");

function Home() {
  return (
    <div>
      <div className="">
        <button onClick={click}>Click</button>
      </div>
    </div>
  );
}

export default Home;
