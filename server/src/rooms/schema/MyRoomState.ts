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
  const colors = ["green", "purple", "gray", "blue", "yellow", "red"];

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

  constructor() {
    super();
    this.deck = genDeck(2);
  }
}

export class Player extends Deck {
  @type("string") name: string;

  constructor(name: string) {
    super();
    this.name = name;
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
  constructor(name: string) {
    super();
    this.name = name;
  }

  @type("string") name: string;

  @type([TableStack]) stacks = new ArraySchema<TableStack>();
  @type({ map: Player }) players = new MapSchema<Player>();
}
