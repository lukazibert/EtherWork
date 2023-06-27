import React, { useEffect, useState } from "react";
import "./App.css";
import CommentList from "./views/Comments";
import Comments from "./views/Comments";
import StackExchangeAuth from "./views/StackExchangeAuth";
import Jobs from "./views/Jobs";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Jobs />
      </div>
      <Routes>
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </Router>
  );
}
export default App;
