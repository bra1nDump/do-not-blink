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
  thisPlayerIdentifier: string;
  state: MyRoomState;
  tryPlayCard: (handIndex: number, tableStackIndex: number) => void;
}

function print(ob: any) {
  console.log(JSON.stringify(ob, null, 2));
}

function App() {
  // Creates a client that is connected to our server
  const client = useRef(new Client("ws://Localhost:2567"));

  // Lobby input fields
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");

  const [room, setRoom] = useState<Room<MyRoomState> | null>(null);

  // Room state will be updated every time any player in the room makes a move
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
        {roomState ? (
          <RoomComponent
            state={roomState}
            thisPlayerIdentifier={room.sessionId}
            tryPlayCard={(handIndex, tableStackIndex) => {
              room.send("try play card", { handIndex, tableStackIndex });
            }}
          />
        ) : (
          <>
            <div>Room name:</div>
            <input
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
            />
            <div>Your nickname:</div>
            <input
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
              }}
            />
            <button
              onClick={async () => {
                setRoom(
                  await client.current.create<MyRoomState>("my_room", {
                    roomName,
                    playerName,
                  })
                );
              }}
            >
              Create room -
            </button>
            <button
              onClick={async () => {
                setRoom(
                  await client.current.join<MyRoomState>("my_room", {
                    roomName,
                    playerName,
                  })
                );
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
  const { name: roomName, players, stacks } = props.state;
  const { name: playerName, deck: hand } = players.get(
    props.thisPlayerIdentifier
  );

  const [playFromHandAtIndex, setPlayFromHandAtIndex] = useState<number | null>(
    null
  );
  const [playToStackAtIndex, setPlayToStackAtIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Player selected both the card to play end the stack to play to
    if (playFromHandAtIndex !== null && playToStackAtIndex !== null) {
      props.tryPlayCard(playFromHandAtIndex, playToStackAtIndex);

      // Once a move is attempted we should clear the stage for the next move
      setPlayFromHandAtIndex(null);
      setPlayToStackAtIndex(null);
    }
  }, [playFromHandAtIndex, playToStackAtIndex, props]);

  return (
    <>
      <div>Stacks on the table</div>
      {stacks.map(({ deck }, index) => {
        const topCard = deck.at(0);
        return (
          <CardComponent
            card={topCard}
            onClick={() => setPlayToStackAtIndex(index)}
          />
        );
      })}
      <div>Players hand</div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {hand
          .toArray()
          .slice(0, 3)
          .map((card, index) => {
            return (
              <CardComponent
                card={card}
                onClick={() => setPlayFromHandAtIndex(index)}
              />
            );
          })}
      </div>
      <button
        onClick={async () => {
          props.tryPlayCard(0, 0);
        }}
      >
        Play card
      </button>
      <pre style={{ fontSize: "small" }}>
        {JSON.stringify(props.state, null, 2)}
      </pre>
    </>
  );
}

interface CardComponentProps {
  card: Card;
  onClick: () => void;
}

function CardComponent(props: CardComponentProps) {
  const { shape, shapeCount, color } = props.card;

  // prettier-ignore
  const layouts: { [key:number]: string[] } = {
    1: [
      "   ", 
      " * ", 
      "   "
    ], 
    2: [
      "*  ", 
      "   ", 
      "  *"
    ], 
    3: [
      "  *", 
      " * ", 
      "*  "
    ], 
    4: [
      "* *", 
      "   ", 
      "* *"
    ], 
    5: [
      "* *", 
      " * ", 
      "* *"
    ]
  };

  // prettier-ignore
  const shapeSymbols: { [key:string]: string } = {
    blizzard: "/",
    circle: "o",
    cross: "x",
    diamond: "!",
    triangle: "^",
    star: "*"
  };

  const cardLayout = layouts[shapeCount].join("\n");
  const shapeSymbol = shapeSymbols[shape];
  const renderedCard = cardLayout.replaceAll("*", shapeSymbol);

  return (
    <>
      <pre
        onClick={props.onClick}
        style={{
          color,

          paddingLeft: "0.3em",
          paddingRight: "0.3em",

          borderWidth: "medium",
          borderRadius: "0.3em",
          borderColor: "black",
          borderStyle: "solid",
        }}
      >
        {renderedCard}
      </pre>
    </>
  );
}

export default App;
