import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import express from "express";
import * as path from "path";
/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";

export default Arena({
  getId: () => "Your Colyseus App",

  initializeGameServer: (gameServer) => {
    /**
     * Define your room handlers:
     */
    gameServer.define("my_room", MyRoom).filterBy(["roomName"]);
  },

  initializeExpress: (app) => {
    const websiteDirectory = path.resolve(__dirname, "../../client/build");
    app.use(express.static(websiteDirectory));

    /**
     * Bind @colyseus/monitor
     * It is recommended to protect this route with a password.
     * Read more: https://docs.colyseus.io/tools/monitor/
     */
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
