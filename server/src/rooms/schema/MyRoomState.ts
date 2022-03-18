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

  constructor(name: string) {
    super();
    this.name = name;
  }
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
