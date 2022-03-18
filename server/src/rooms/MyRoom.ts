import { Room, Client } from "colyseus";
import { MyRoomState, Player, TableStack } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  onCreate(options: any) {
    super.roomId = options.roomName;
    this.setState(new MyRoomState(options.roomName));

    this.onMessage("play card", (client, { sourceIndex, stackIndex }) => {
      const playerDeck = this.state.players.get(client.id).deck;
      const destinationStack = this.state.stacks.at(stackIndex);
      if (destinationStack.tryAdd(playerDeck.at(sourceIndex))) {
        // Successfully played card, removing from player
        playerDeck.deleteAt(sourceIndex);
      }
    });
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
