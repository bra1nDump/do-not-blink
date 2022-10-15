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

# Presentation

How I have failed to keep attention of the 8 graders?
- Going off based of text slides when designing the game
  - A much better strategy would be to slowly place UI elements on the game
  - This will give them an iterative feeling
- Talking about the server 
  - Show the adman consol. It's much more useful to show them the actual data that the server stores
  - They have no idea what data structures are, They need to see them first, and they need to see them in action.
- Hot spotting takes a long time, 
- Entering the http long link manually takes a long time!!! Posting to their channels like schoology works much better, as the teacher to post the link
  - The best solution of courses to use a custom domain as well as configured for https, but that is more work

## Ideal flow
- Do not bore them with the details of my job, talk about this later one they're hyped up
- Play the physical game right away
 
- The first slide should be starting the design of the online game, it should be made by screen shotting each essential UI component iteratively as they come up with it
- Ideally it should be already on their computers gradually appearing (the presentation is literally on their computers)
- Once we finished the room entry screen and click enter, they should be able to see a blank screen yet again. Repeat the process for the game itself. 
  - Show how the server stores each card, Once they say we need to be able to see our hand, and they say that we need to show 3 cards, explain that the easier task is to show a single cart and we should tackle that first. 
  - Explain how the rendering of a given card works. The browser receives the card data: dictionary with text end numbers. The browser simply draws a pattern using text, Sets the background color.
  - As table stacks, and their hand is appearing on their computer show how it maps to the internal representation on the server.
- Start playing, and then abruptly pause. Do you want to know your standing? Toggled this UI. Continue playing until the end. Incremental improvements

- What we have covered?
  - How you come up with all components needed for a simple multiplayer game
  - How to roughly make the browser display things we want
  - How does the server store data for every online game
  - How to brainstorm new ideas and make incremental improvements
- Explain what we have not covered in this presentation:
  - Randomization
  - How to rent a server? 
  - How to find the correct language end library for your project? Google
  - How to trouble should what something doesn't work? Google, friends, mentors

- Different career paths available in programming
- UI
  - Websites
  - Mobile applications
- Server
  - Storage, Databases
  - Deployment
  - Core product logic
- Machine learning

Areas you can work in
- Social networks, Tick Talk, Instagram, Facebook
- Commerce  Amazon 
- Games

Each area and part of the process requires special knowledge, but at all starts with engineering design, team work .


# Game Itself
- Every one wants special effects, Add music, gifs, animations to make it more interactive
- The fact that we need to wait until everybody joins completely manually is very inconvenient. The host needs to be able to start the game once everyone is in. This is a very easy change but will make playing much more organized. 
- Also having a single player win is limiting the wow effect of the game, we need a ranking of who finished first.


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

# Resources

## Our game

- [Blink original article I found](https://susan-joy-clark.com/2018//24/if-you-like-uno-and-dutch-blitz-youll-love-blink/)
- [Game state management library](https://github.com/colyseus/colyseus)

## Explore more

- [Multiplayer air hockey](http://sqoff.com/)
- [Open source games](https://github.com/leereilly/games)
- [Shedding card games (getting of your cards is the goal)](https://en.wikipedia.org/wiki/List_of_shedding-type_games)
