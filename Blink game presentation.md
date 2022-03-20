# Plan

- 5 min career overview
  - During my first year in university started coding during data structures and C class
  - Wanted to build an end product and had a iPhone at the time - made a calculator
  - Started building more iPhone apps with friends and went to hackathons
  - Started at UCLA Computer Science
  - Got an internship in a startup and converted to a full time job, paused school
  - Startup failed, 2 months job hunting landed the job at Meta IC 4 Software Engineer with another offer as testing engineer from Apple
  - Got Repetitive Strain Injury from typing (which I wasn't doing that much) and have been transitioning to voice coding for the past year. I have actually prepared this presentation without touching my keyboard
  - Want to get more involved with developer experience, specifically text editors, language compilers and other tools
- 8 / Understanding
  - 2 / Team formation with three to four people
  - 2 / Explain the rules and terminology (player's hand, stacks)
  - 2 / Hand out cards
  - 2 / Play a round with real cards
- 14 / Modeling the game
  - 3 / What does the game consist of? Hint: let's say you pause the game, how do you continue it later in a different location?
    - Players hands
    - Stacks on the table
    - Contents of a game at any given time are also called 'state'
  - 3 / What held the state of the games we were playing just now?
    - Table
    - Players
  - 2 / When you are playing a computer game what holds it's state?
    - The computer
    - What about multiplayer games?
      - Computer you are playing on. Knon as the client
      - A computer that all players connect to. Known as the server.
  - 5 / How does our game run? How would it run online?
    - We sit at a table.
    - We deal cards.
    - How do we know when to start?
    - How do we make a move?
    - How do other players know we made a move?
- 9 / Testing the game
  - All go to the webpage for our game
  - 2 / Get a volunteer to play a example game.
  - 4 / Make sense of server logs. (Make sure the logs include all the steps from the game)
  - 3 / Everyone plays an example game
- 7 Changing the game
  - 3 / How can we change the game? Would this change go on the client or the server?
    - Reward streaks with extra points. Remove an additional card from the player.
    - Display remaining card count of other players.
    - Reveal an additional card
    - Display emoji of the player who's card is on top of the stack
  - 2 / Implement the change
  - 2 / Let the volunteers play the game
- Closing notes
  - Think about how we have applied the engineering design process during building without a single blink
    - Understood the process
    - Formally modeled it
    - Found the right tools for the job (colyseus, ngrok)
    - Implemented the first draft
    - Tested it and improved it as a group
    - Had fun!
  - Remember to stay curious and try a bunch of things
  - How to find the presentation, how to find me

# To Do

- [ ] Make a presentation from the plan above
- [ ] Test with ngrok
- [ ] Remove create room button
- [ ] Make user names emojis
- [ ] Maybe do drag and drop
- [ ] Style the game
- [ ] Refactor names
- [ ] Insert code snippets into the presentation. This will allow us to think about changing the code without looking in the entire code base

## Technical resources

- https://create-react-app.dev/docs/proxying-api-requests-in-development

# Resources

## Our game

- [Blink original article I found](https://susan-joy-clark.com/2018//24/if-you-like-uno-and-dutch-blitz-youll-love-blink/)
- Repository
- Frontend sandbox - optional
- [Game state management library](https://github.com/colyseus/colyseus)

## Explore more

- [Multiplayer air hockey](http://sqoff.com/)
- [Open source games](https://github.com/leereilly/games)
- [Shedding card games (getting of your cards is the goal)](https://en.wikipedia.org/wiki/List_of_shedding-type_games)
