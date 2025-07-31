import * as React from "react";
import { createRoot } from "react-dom/client";

const TestApp = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>FreshMart Test App</h1>
      <p>If you can see this, React is working correctly!</p>
      <button onClick={() => alert("Button clicked!")}>Test Button</button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<TestApp />);
