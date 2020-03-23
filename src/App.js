import React from "react";
import "./App.css";
import Calendar from "./components/Calendar";

function App() {
  const style = {
    position: "relative"
  };
  return (
    <div>
      <Calendar style={style} />
    </div>
  );
}

export default App;
