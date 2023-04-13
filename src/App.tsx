import React, { useEffect, useState } from "react";
import "./App.css";
import CommentList from "./views/Comments";
import Comments from "./views/Comments";
import StackExchangeAuth from "./views/StackExchangeAuth";

function App() {

  return (
    <div className="App">
      <StackExchangeAuth/>
    </div>
  );
}

export default App;
