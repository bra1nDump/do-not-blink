import React, { useEffect, useRef, useState } from "react";
import { Client, Room } from "colyseus.js";
import "./App.css";

interface State {
  mySynchronizedProperty: string;
}

function App() {
  const client = useRef(new Client("ws://localhost:2567"));

  const [roomName, setRoomName] = useState("");
  const [roomState, setRoomState] = useState<State | null>(null);

  return (
    <div className="App">
      <header className="App-header">
        {roomState ? (
          <RoomComponent {...roomState} />
        ) : (
          <>
            <div>Room name</div>
            <input
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
            />
            <button
              onClick={async () => {
                const room = await client.current.create<State>("my_room", {
                  id: roomName,
                });
                room.onStateChange(setRoomState);
              }}
            >
              Create room
            </button>
            <button
              onClick={async () => {
                const room = await client.current.joinById<State>(roomName);
                room.onStateChange(setRoomState);
              }}
            >
              Join room
            </button>
          </>
        )}
      </header>
    </div>
  );
}

function RoomComponent(props: State) {
  return <div>{JSON.stringify(props, null, 2)}</div>;
}

export default App;
