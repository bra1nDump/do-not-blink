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

function genDeck(count: number) {
  const random = (upperNonInclusive: number) =>
    Math.floor(Math.random() * upperNonInclusive);

  const shapes = ["blizzard", "circle", "cross", "diamond", "triangle", "star"];
  const colors = ["green", "purple", "green", "blue", "black", "red"];

  const cards = [...Array(count)].map(() => {
    const card = new Card();
    card.shape = shapes[random(shapes.length)];
    card.shapeCount = random(5) + 1;
    card.color = colors[random(colors.length)];
    return card;
  });
  return new ArraySchema<Card>(...cards);
}

export class Deck extends Schema {
  @type([Card]) deck: ArraySchema<Card>;
}

export class Player extends Deck {
  @type("string") name: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.deck = genDeck(20);
  }
}

export class TableStack extends Deck {
  constructor() {
    super();
    this.deck = genDeck(1);
  }

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
  @type("string") name: string;
  @type("string") winner?: string;

  @type([TableStack]) stacks = new ArraySchema<TableStack>();
  @type({ map: Player }) players = new MapSchema<Player>();

  constructor(name: string) {
    super();
    this.name = name;
    this.stacks.unshift(new TableStack(), new TableStack());
  }

  tryPlayCard(
    playerIdentifier: string,
    handIndex: number,
    tableStackIndex: number
  ) {
    console.log(`${this.name}: `);

    if (this.winner !== undefined) {
      console.log(`Too late to make a move, the winner is ${this.winner}`);
      return;
    }

    const player = this.players.get(playerIdentifier);
    const theirDeck = player.deck;
    const destinationStack = this.stacks.at(tableStackIndex);
    if (destinationStack.tryAdd(theirDeck.at(handIndex))) {
      console.log(
        "Successfully played card, moving it from player to one of the table stacks"
      );
      // Swap with last card and then delete last card
      // Otherwise the player will observe a shift in their cards
      theirDeck.setAt(handIndex, theirDeck.at(theirDeck.length - 1));
      theirDeck.pop();
    } else {
      console.log(
        "Failed to play card, please check with your role book before trying next time :D"
      );
    }

    // If the player who just made the move ran out of cards
    // declare them the winner
    if (theirDeck.length === 0) {
      this.winner = player.name;
    }

    // this.stacks.toArray().forEach((stack) => {
    //   // get first card for each stack
    //   const firstCard = stack.deck.at(0);

    //   const players = Array(this.players.entries());
    //   for (cons)
    // });
  }
}
