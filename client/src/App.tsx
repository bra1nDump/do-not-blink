import React, {
  useCallback,
  useDebugValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client, Room } from "colyseus.js";
import "./App.css";

import {
  Schema,
  Context,
  type,
  ArraySchema,
  MapSchema,
} from "@colyseus/schema";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

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
  @type("string") winner?: string;

  @type([TableStack]) stacks = new ArraySchema<TableStack>();
  @type({ map: Player }) players = new MapSchema<Player>();
}

interface RoomProps {
  thisPlayerIdentifier: string;
  state: MyRoomState;
  tryPlayCard: (handIndex: number, tableStackIndex: number) => void;
  exitGame: () => void;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game />
      </header>
    </div>
  );
}

// In development mode connect to local host
const inDevelopmentMode = process.env.NODE_ENV === "development";

function Game() {
  let clientAddress = inDevelopmentMode
    ? "ws://localhost:2567"
    : "ws://do-not-blink.loca.lt";
  // : "ws://6ac3-2601-647-5a00-60e0-e9be-dbd8-a689-6a4.ngrok.io/";
  // Creates a client that is connected to our server
  const client = useRef(new Client(clientAddress));

  // Lobby input fields
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");

  const [room, setRoom] = useState<Room<MyRoomState> | null>(null);

  // Called when 'Join or create room' is clicked
  const joinOrCreateOnClick = useCallback(() => {
    client.current
      .joinOrCreate<MyRoomState>("my_room", {
        roomName,
        playerName: inDevelopmentMode ? Math.random().toString() : playerName,
      })
      .then(setRoom);
  }, [roomName, playerName]);

  // Immediately dropped into a room for debugging UI
  useEffect(() => {
    if (!inDevelopmentMode) {
      return;
    }
    joinOrCreateOnClick();
  }, [joinOrCreateOnClick]);

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

    const cleanUp = () => {
      room?.leave();
    };
    return cleanUp;
  }, [room]);

  if (roomState) {
    return (
      <RoomComponent
        state={roomState}
        thisPlayerIdentifier={room.sessionId}
        tryPlayCard={(handIndex, tableStackIndex) => {
          room.send("try play card", { handIndex, tableStackIndex });
        }}
        exitGame={async () => {
          setRoomState(null);
          setRoom(null);
        }}
      />
    );
  } else {
    return (
      <>
        <div>Room name:</div>
        <input
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
        />

        {/* Player picker */}
        <div>Choose your warrior:</div>
        <ToggleButtonGroup
          exclusive={true}
          value={playerName}
          onChange={(_, x) => setPlayerName(x)}
        >
          <ToggleButton value="💩">💩</ToggleButton>
          <ToggleButton value="🤡">🤡</ToggleButton>
          <ToggleButton value="🗿">🗿</ToggleButton>
        </ToggleButtonGroup>

        <Button
          // Disable the button if room name or player is not picked
          disabled={!roomName || !playerName}
          onClick={joinOrCreateOnClick}
        >
          Join or create
        </Button>
      </>
    );
  }
}

function RoomComponent(props: RoomProps) {
  const { name: roomName, players, stacks, winner } = props.state;
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

  // Winner field from the game server matches our own name
  // This must mean we won
  if (winner === playerName) {
    return (
      <>
        <h1>Congratulations {playerName} you win!!</h1>
        <Button onClick={props.exitGame}>Back to lobby</Button>
      </>
    );
  } else if (
    // Winner field has some other user name
    // This must mean somebody else won
    winner !== undefined
  ) {
    return (
      <>
        <h1>
          {playerName} tough luck, {winner} is the winner
        </h1>
        <Button onClick={props.exitGame}>Back to lobby</Button>
      </>
    );
  }

  return (
    <>
      <div>Stacks on the table</div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {stacks.map(({ deck }, index) => {
          const topCard = deck.at(0);
          return (
            <CardComponent
              card={topCard}
              onClick={() => setPlayToStackAtIndex(index)}
            />
          );
        })}
      </div>

      <div style={{ height: "10em" }}></div>
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
      <div>Your cards</div>
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

          margin: "0.3em",

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
