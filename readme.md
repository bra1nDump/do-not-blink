# Run the game
Initialization code lives in top level `package.json`
In the project root run:
```bash
npm run postinstall # Installs all dependencies
npm build # Builds the three components listed below
npm start # Starts the server
```

# Play around locally
http://localhost:3000 - The game itself
http://localhost:3000/colyseus - Administrative panel for all games happening now
http://localhost:3000/presentation.html - Presentation

# Structure
There are 3 components:
- Presentation. Gets built from this directory from presentation.md -> presentation.html. Is later served by the game server.
- Website aka Frontend aka Client. This is the UI of the project. /client
- Server aka Game server aka express application. It both runs the game server && serves static files for the Presentation and Website.

[Key] Most initialization code lives in `server/src/arena.config.ts`
- It creates room definition
- It initializes express and starts serving the presentaiton & website itself

# Deployment
Currently the game is served on herokuapp.com, it was free at the time but now they make you pay for even the small servers.
Currently to deploy to heroku you need to simply `git push main` (assuming you have github x heroku hooked up like I do on my account, needs additional setup, easy to google).

The url of the app is http://notblink.herokuapp.com.

# Did not make it to the presentation

- 2 / When you are playing a computer game what holds it's state?
  - The computer
  - What about multiplayer games?
    - Computer you are playing on. Knon as the client
    - A computer that all players connect to. Known as the server.

# To Do

- [x] Make a presentation from the plan above
- [x] Remove create room button
- [x] Make user names emojis
- [x] Show endgame state
- [x] Style the game
- [x] Serve build website from the backend
- [x] Fixed the number of stacks on the table to 2
- [ ] Insert code snippets into the presentation. This will allow us to think about changing the code without looking in the entire code base
- [x] Test with ngrok, and local tunnel
  - [ ] It is kind of slow, maybe try deploying it
- [ ] Refactor namesi
- [ ] Maybe do drag and drop
- [ ] Smaller layout height
- [ ] Reload note if doesn't work

deploy server folder
I need root/ presentation in the server dir & client in server

## Technical resources

- https://create-react-app.dev/docs/proxying-api-requests-in-development

# Resources

## Our game

- [Blink original article I found](https://susan-joy-clark.com/2018//24/if-you-like-uno-and-dutch-blitz-youll-love-blink/)
- Repository
- [Game state management library](https://github.com/colyseus/colyseus)

## Explore more

- [Multiplayer air hockey](http://sqoff.com/)
- [Open source games](https://github.com/leereilly/games)
- [Shedding card games (getting of your cards is the goal)](https://en.wikipedia.org/wiki/List_of_shedding-type_games)
