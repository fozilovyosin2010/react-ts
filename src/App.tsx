import React, { useState } from "react";
import Counter from "./Components/Counter";
import { ErrorBoundary } from "react-error-boundary";

const Compos = () => {
  return <div>Some error</div>;
};

const App = () => {
  return (
    <div>
      <ErrorBoundary FallbackComponent={Compos}>
        {/* ErrorBoundary can handle Rendering & lifecycle errors */}
        <Counter />
      </ErrorBoundary>
    </div>
  );
};

export default App;
