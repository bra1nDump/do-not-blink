import React, { useDebugValue, useEffect, useRef, useState } from "react";
import { Client, Room } from "colyseus.js";
import "./App.css";

import {
  Schema,
  Context,
  type,
  ArraySchema,
  MapSchema,
} from "@colyseus/schema";

export class Card extends Schema {
  @type("string") shape: string;
  @type("number") shapeCount: number;
  @type("string") color: string;
}

export class Deck extends Schema {
  @type([Card]) deck: ArraySchema<Card>;

  constructor() {
    super();
    const cards = [...Array(2)].map(() => {
      const card = new Card();
      card.shape = [
        "blizzard",
        "circle",
        "cross",
        "diamond",
        "triangle",
        "star",
      ][0];
      card.shapeCount = 1;
      card.color = ["green", "purple", "gray", "blues", "yellow", "red"][0];
      return card;
    });
    this.deck = new ArraySchema<Card>(...cards);
  }
}

export class Player extends Deck {
  @type("string") name: string;
}

export class TableStack extends Deck {
  tryAdd(card: Card): boolean {
    const top = this.deck.at(0);
    if (
      top.color === card.color ||
      top.shape === card.shape ||
      top.shapeCount === card.shapeCount
    ) {
      this.deck.unshift(card);
      return true;
    }
    return false;
  }
}

export class MyRoomState extends Schema {
  constructor(name: string) {
    super();
    this.name = name;
  }

  @type("string") name: string;

  @type([TableStack]) stacks = new ArraySchema<TableStack>();
  @type({ map: Player }) players = new MapSchema<Player>();
}

interface RoomProps {
  state: MyRoomState;
  tryPlayCard: (handIndex: number, tableStackIndex: number) => void;
}

function print(ob: any) {
  console.log(JSON.stringify(ob, null, 2));
}

function App() {
  const client = useRef(new Client("ws://localhost:2567"));

  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState<Room<MyRoomState> | null>(null);
  const [roomState, setRoomState] = useState<MyRoomState | null>(null);

  useEffect(() => {
    room?.onStateChange((stateReference) => {
      // State object remains the same throughout room's lifetime.
      // If we simply pass stateReference to setRoomState
      // react will be tricked into thinking the state has not changed
      // and our component will not be re rendered.
      setRoomState(Object.assign({}, stateReference));
    });

    return room?.removeAllListeners;
  }, [room]);

  return (
    <div className="App">
      <header className="App-header">
        {room ? (
          <RoomComponent
            state={roomState}
            tryPlayCard={(handIndex, tableStackIndex) => {
              room.send("try play card", { handIndex, tableStackIndex });
            }}
          />
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
                setRoom(
                  await client.current.create<MyRoomState>("my_room", {
                    roomName,
                    playerName: "pp",
                  })
                );
              }}
            >
              Create room -
            </button>
            <button
              onClick={async () => {
                setRoom(await client.current.joinById<MyRoomState>(roomName));
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

function RoomComponent(props: RoomProps) {
  return (
    <>
      <button
        onClick={async () => {
          props.tryPlayCard(0, 0);
        }}
      >
        Play card
      </button>
      <pre>{JSON.stringify(props.state, null, 2)}</pre>
    </>
  );
}

export default App;
