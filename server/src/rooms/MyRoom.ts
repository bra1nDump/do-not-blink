import { Room, Client } from "colyseus";
import { MyRoomState, Player, TableStack } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  onCreate(options: any) {
    this.setState(new MyRoomState(options.roomName));

    this.onMessage(
      "try play card",
      (client, { handIndex, tableStackIndex }) => {
        console.log("Trying to play a card");

        const playerDeck = this.state.players.get(client.id).deck;
        const destinationStack = this.state.stacks.at(tableStackIndex);
        if (destinationStack.tryAdd(playerDeck.at(handIndex))) {
          console.log("Successfully played card, removing from player");
          playerDeck.deleteAt(handIndex);
        } else {
          console.log(
            "Failed to play card, please check with your role book before trying next time :D"
          );
        }
      }
    );
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player(options.playerName));
    this.state.stacks.unshift(new TableStack());
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
