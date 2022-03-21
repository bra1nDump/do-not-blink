# Plan

- 5 / Introductions
  - About me
    - Always wanted to build something cool
    - Started programming by building iPhone apps with friends and going to hackathons
    - Currently at Meta as an IC 4 Software Engineer
    - Got Repetitive Strain Injury and have been transitioning to voice coding for the past year. I have actually prepared this presentation without touching my keyboard
  - What is the coolest thing you have done in this class?
  - Today we will be building a multiplayer web browser version of the game called Blink
- 8 / Understanding Blink
  - 2 / Team formation with 3-4 people
  - 2 / Explain the rules and terminology (player's hand, stacks)
  - 2 / Hand out cards
  - 2 / Play a round with real cards
- 14 / Modeling the game
  - 3 / How does our game start?
    - We pick a table and sit
    - Players get their cards:
      - `Player 🌝 : [ card 1, card 2, card 3, ... hidden cards ]`
      - `Player 🤡 : [ card 1', card 2', card 3', ... hidden cards ]`
    - 2 stacks are on the table, they start with one card:
      - `Stack 1 : [ random card ]`
      - `Stack 2 : [ random card ]`
    - Individual cards:
      - `{ shape count: 3, shape: star, shape color: blue }`
  - How does the game run?
    - How do we make a move?
      - `Player 🌝` picks `card 3`
      - Player places it on top of `Stack 1`
      - Others verify that at least one feature between `card 3` and `Stack 1 top card` matches
      - Our table now looks like this:
      -
      - `[last played card (on top), ... bottom cards]`
    - How do other players know we made a move?
    - How do we determine the winner?
  -
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
    - If player makes a wrong turn, give them an extra card
  - 2 / Implement the change
  - 2 / Let the volunteers play the game
- Closing notes
  - How did we apply engineering design process today?
    - Research - played the game
    - Imagine, Plan - described in plain english how the game would work
    - Create - implemented the first draft
    - Tested and improved it as a group
    - Had fun!
  - Remember to stay curious and try a bunch of things
  - Q&A
    - Presentation link
    - Tools used colyseus, react, ngrok
    - It took me ~24 hours to prepare this

# Did not make it to the presentation

- 2 / When you are playing a computer game what holds it's state?
  - The computer
  - What about multiplayer games?
    - Computer you are playing on. Knon as the client
    - A computer that all players connect to. Known as the server.

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
