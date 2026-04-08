import React from "react";
import { useCnt } from "./Store/useCnt";

const App = () => {
  const cnt = useCnt((store) => store);

  return (
    <div>
      <div>cnt: {cnt.counter}</div>
      <div className="flex">
        <button onClick={cnt.increment} className="border">
          +
        </button>
        <button onClick={cnt.decrement} className="border">
          -
        </button>
      </div>
    </div>
  );
};

export default App;
