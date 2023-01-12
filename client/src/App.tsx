import React, {
  useCallback,
  useDebugValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client, Room, RoomAvailable } from "colyseus.js";
import "./App.css";

import useSound from "use-sound";

import {
  Schema,
  Context,
  type,
  ArraySchema,
  MapSchema,
} from "@colyseus/schema";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Initialize firebase real time database for UI configuration
const firebaseConfig = {
  databaseURL: "https://do-not-blink-id-default-rtdb.firebaseio.com/",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// What is the game called
// How do we play the game
// First of all we needed to be in the same room
// Rename Room to Table
const defaultUIConfiguration = {
  lobby: {
    listExistingRooms: false,
    showRoomNamePicker: false,
    createButton: false, // Create room button
    showPlayerName: false,
  },
  game: {
    showStacksOnTheTable: false,
    showPlayerName: false,
    showHand: false,
    showHandCount: false,
    showDrawIfStuck: false,
    showOpponents: false,
  },
  // Forces all elements to be enabled when true
  // For debugging purpuses
  enableAll: false,
};
type UIConfiguration = typeof defaultUIConfiguration;

// Print out to easily update the firebase database
console.log(JSON.stringify(defaultUIConfiguration, null, 2));

// Used to flip all flags
const objectMap = (obj: any, fn: (v: any) => any) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v)]));

var randomEmoji = require("random-emoji");
//const boopSfx = require("./../beep-01a.mp3");

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
  @type("number") startDate: number;

  @type([TableStack]) stacks = new ArraySchema<TableStack>();
  @type({ map: Player }) players = new MapSchema<Player>();
}

interface RoomProps {
  thisPlayerIdentifier: string;
  interfaceConfiguration: typeof defaultUIConfiguration.game;
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

// http://notblink.herokuapp.com/

// In development mode connect to local host
const inDevelopmentMode = process.env.NODE_ENV === "development";

function generarateRandomEmojis(): string {
  let emojis = randomEmoji
    .random({ count: 2 })
    .map((em: any) => em.character)
    .join("");
  console.log(emojis);
  return emojis;
}

function Game() {
  let clientAddress = inDevelopmentMode
    ? "ws://localhost:2567"
    : `wss://${window.location.hostname}`;
  // Creates a client that is connected to our server
  const client = useRef(new Client(clientAddress));

  const [configuration, setConfiguration] = useState<UIConfiguration>(
    defaultUIConfiguration
  );
  useEffect(() => {
    onValue(ref(database), (snapshot) => {
      const newConfiguration: UIConfiguration = snapshot.val();
      console.table(newConfiguration);

      // Enable all elements
      if (newConfiguration.enableAll) {
        setConfiguration({
          lobby: objectMap(newConfiguration.lobby, () => true),
          game: objectMap(newConfiguration.game, () => true),
          enableAll: true,
        } as UIConfiguration);
      } else {
        setConfiguration({ ...newConfiguration });
      }
    });
  }, []);

  const [availableRooms, setAvailableRooms] = useState<
    RoomAvailable<MyRoomState>[] | null
  >(null);

  const [triggerNewFetch, setTriggerNewFetch] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      client.current.getAvailableRooms<MyRoomState>("my_room").then((rooms) => {
        setAvailableRooms(rooms);
      });
      setTriggerNewFetch(triggerNewFetch + 1);
    }, 500);
  }, [triggerNewFetch]);

  // Lobby input fields
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState(generarateRandomEmojis);

  const [room, setRoom] = useState<Room<MyRoomState> | null>(null);

  // Called when 'Join or create room' is clicked
  const joinOrCreateOnClick = useCallback(() => {
    client.current
      .joinOrCreate<MyRoomState>("my_room", {
        roomName: generarateRandomEmojis(),
        playerName,
      })
      .then(setRoom)
      .catch((error) => {
        window.alert(
          "Error connecting, check that:\nYou are connected to a hotspot, not LAUSD wifi\n"
        );
      });
  }, [roomName, playerName]);

  // Immediately dropped into a room for debugging UI
  useEffect(() => {
    if (!inDevelopmentMode) {
      return;
    }
    // joinOrCreateOnClick();
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
        interfaceConfiguration={configuration.game}
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
        {/* List of available rooms */}
        {configuration.lobby.listExistingRooms && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {availableRooms &&
              availableRooms.length !== 0 && [
                <div>Existing rooms (click to join)</div>,
                ...availableRooms.map((room, i) => {
                  const { name } = room.metadata;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setRoomName(name);
                        joinOrCreateOnClick();
                      }}
                    >
                      {name}, players: {(room.metadata as any).playerCount}
                    </button>
                  );
                }),
              ]}
          </div>
        )}

        {/* Room name picker */}
        {configuration.lobby.showRoomNamePicker && (
          <>
            <div>Room name:</div>
            <input
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
            />
          </>
        )}

        {/* Player picker */}
        {configuration.lobby.showPlayerName && (
          <div>Your player is {playerName}</div>
        )}

        {/* Join or create room button */}
        {configuration.lobby.createButton && (
          <Button
            // Disable the button if room name or player is not picked
            // disabled={!roomName}
            onClick={joinOrCreateOnClick}
          >
            Create
          </Button>
        )}
      </>
    );
  }
}

function RoomComponent(props: RoomProps) {
  const { name: roomName, startDate, players, stacks, winner } = props.state;

  const secondsUntilStart = new Date(
    startDate - new Date().getTime()
  ).getSeconds();
  const isStarted = secondsUntilStart < 0;

  const {
    showStacksOnTheTable,
    showPlayerName,
    showHand,
    showHandCount,
    showDrawIfStuck,
    showOpponents,
  } = props.interfaceConfiguration;

  // Fort each used instead of map because the Colleseus framework doesn't support map
  let playerNamesAndCardsRemaining: [string, number][] = [];
  players.forEach((player) => {
    playerNamesAndCardsRemaining.push([player.name, player.deck.length]);
  });

  const { name: playerName, deck: hand } = players.get(
    props.thisPlayerIdentifier
  );

  // playerNamesAndCardsRemaining = playerNamesAndCardsRemaining.filter(
  //   (name) => name !== playerName
  // );

  const [visibleCount, setvisibleCount] = useState(3);
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

  useEffect(() => {
    if (playerName && winner === playerName) {
      let audio = new Audio(
        "https://file-examples.com/storage/fe0b521bf8623b6639a0f85/2017/11/file_example_MP3_700KB.mp3"
      );
      audio.play();
    }
  }, [winner, playerName]);

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
      <h4 style={{ marginBlockStart: "1vw", marginBlockEnd: "1vw" }}>
        Room {roomName}{" "}
        {isStarted ? "- Started" : `- Until start ${secondsUntilStart}s`}{" "}
      </h4>

      {/* Opponents */}

      {showOpponents && (
        <>
          <h4 style={{ marginBlockStart: "1vw", marginBlockEnd: "1vw" }}>
            All players{" "}
            {playerNamesAndCardsRemaining
              .sort(([, a], [, b]) => a - b)
              .map(([userName, cardCount]) => `${userName}: ${cardCount}`)
              .join(", ")}
          </h4>
        </>
      )}

      {/* Table stacks */}
      {showStacksOnTheTable && (
        <>
          <div>Stacks on the table</div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {stacks.map(({ deck }, index) => {
              const topCard = deck.at(0);
              return (
                <CardComponent
                  key={index}
                  card={topCard}
                  selected={playToStackAtIndex === index}
                  onClick={() => setPlayToStackAtIndex(index)}
                />
              );
            })}
          </div>
        </>
      )}

      {/* Hand */}
      {showHand && (
        <>
          <div style={{ height: "5vh" }}></div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {hand
              .toArray()
              .slice(0, visibleCount)
              .map((card, index) => {
                return (
                  <CardComponent
                    key={index}
                    card={card}
                    selected={playFromHandAtIndex === index}
                    onClick={() => {
                      // If we prevent this code from being run before timeout - we are good
                      if (isStarted) {
                        setPlayFromHandAtIndex(index);
                      }
                    }}
                  />
                );
              })}
          </div>
        </>
      )}

      {/* Player name */}
      {showPlayerName && (
        <>
          <h2 style={{ margin: "3vw" }}>
            Player: {playerName}
            {", "}
            {showHandCount && `🃏s remaining: ${hand.length}`}
          </h2>
        </>
      )}

      {/* Cards to get rid of */}

      {/* Unstuck controls */}
      {showDrawIfStuck && (
        <>
          <button onClick={() => setvisibleCount(visibleCount + 1)}>
            Draw (if all players are stuck)
          </button>
        </>
      )}
    </>
  );
}

interface CardComponentProps {
  card: Card;
  selected: boolean;
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
    blizzard: "@",
    circle: "=",
    cross: "ƒ",
    diamond: "$",
    triangle: "■",
    star: "¤"
  };

  const cardLayout = layouts[shapeCount].join("\n");
  const shapeSymbol = shapeSymbols[shape];
  const renderedCard = cardLayout.replaceAll("*", shapeSymbol);

  return (
    <>
      <pre
        onClick={props.onClick}
        style={{
          WebkitTextFillColor: color,
          backgroundColor: "white",
          fontWeight: "bold",
          fontFamily: "monospace",

          margin: "0.3em",

          paddingLeft: "0.5em",
          paddingRight: "0.5em",
          paddingTop: "0.4em",
          paddingBottom: "0.4em",

          borderWidth: "2px",
          borderRadius: "0.3em",
          borderColor: props.selected ? "gold" : "black",
          borderStyle: "solid",

          color: "gray",
          boxShadow: "2px 3px 4px",
        }}
      >
        {renderedCard}
      </pre>
    </>
  );
}

export default App;
