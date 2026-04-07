import React, { createContext, useState } from "react";
import Card from "./Componets/Card";

export const CntContext = createContext();
const App = () => {
  const [cnt, setCnt] = useState(0);
  return (
    <div>
      <CntContext.Provider value={cnt}>
        <button onClick={() => setCnt((e) => e + 1)}>+</button>
        <Card />
      </CntContext.Provider>
    </div>
  );
};

export default App;
