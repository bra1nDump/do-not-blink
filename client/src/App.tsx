import React, { useRef, useState } from "react";
import logo from "./logo.svg";
import * as c from "colyseus.js";
import "./App.css";

function App() {
  const client = useRef(new c.Client("ws://localhost:2567"));
  async function createRoom() {
    const room = await client.current.create("my_room", {});
    room.send("play card");
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button aria-label="Great room" onClick={createRoom} />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
