import { Room, Client } from "colyseus";
import { MyRoomState, Player, TableStack } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  onCreate(options: any) {
    this.setState(new MyRoomState(options.roomName));

    this.onMessage(
      "try play card",
      (client, { handIndex, tableStackIndex }) => {
        this.state.tryPlayCard(client.sessionId, handIndex, tableStackIndex);
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
