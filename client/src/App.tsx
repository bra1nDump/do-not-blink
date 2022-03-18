import React, { useEffect, useRef, useState } from "react";
import { Client, Room } from "colyseus.js";
import "./App.css";

interface State {
  mySynchronizedProperty: string;
}

function App() {
  const [room, setRoom] = useState<State | null>(null);
  const client = useRef(new Client("ws://localhost:2567"));
  useEffect(() => {}, [room]);
  return (
    <div className="App">
      <header className="App-header">
        {room ? (
          <div>{room.mySynchronizedProperty}</div>
        ) : (
          <button
            onClick={async () => {
              const room = await client.current.create<State>("my_room", {
                id: "world",
              });
              room.onStateChange(setRoom);
            }}
          >
            Create room
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
