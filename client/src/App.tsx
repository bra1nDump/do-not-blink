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

function RoomComponent(props: RoomProps) {
  console.log("RoomComponent");

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

interface RoomClassProps {
  room: Room<MyRoomState>;
  tryPlayCard: (handIndex: number, tableStackIndex: number) => void;
}

class RoomClass extends React.Component<RoomClassProps, MyRoomState> {
  constructor(props: RoomClassProps) {
    super(props);
    this.state = null;
    props.room.onStateChange((state) => {
      this.setState(state);
    });
  }

  public render() {
    return (
      <>
        <button
          onClick={async () => {
            this.props.tryPlayCard(0, 0);
          }}
        >
          Play card
        </button>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </>
    );
  }
}

function App() {
  const client = useRef(new Client("ws://localhost:2567"));

  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState<Room<MyRoomState> | null>(null);
  const [roomState, setRoomState] = useState<MyRoomState | null>(null);

  useEffect(() => {
    if (room) {
      const handleChange = (params: MyRoomState): void => {
        setRoomState(params);
        //room.removeAllListeners();
        console.log(roomState);
      };
      //room.onStateChange(handleChange);
      return () => {
        //room.removeAllListeners();
      };
    }
  }, [room, roomState]);

  console.log(JSON.stringify(roomState, null, 2));

  return (
    <div className="App">
      <header className="App-header">
        {room ? (
          // <RoomComponent
          //   state={roomState}
          //   tryPlayCard={(handIndex, tableStackIndex) => {
          //     room.send("try play card", { handIndex, tableStackIndex });
          //   }}
          // />
          <RoomClass
            room={room}
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
                const roomL = await client.current.create<MyRoomState>(
                  "my_room",
                  {
                    roomName,
                    playerName: "pp",
                  }
                );
                setRoom(roomL);
                // roomL.onStateChange((params) => {
                //   setRoomState(params);
                // });
              }}
            >
              Create room -
            </button>
            <button
              onClick={async () => {
                const roomL = await client.current.joinById<MyRoomState>(
                  roomName
                );
                setRoom(roomL);
                roomL.onStateChange(setRoomState);
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

export default App;
