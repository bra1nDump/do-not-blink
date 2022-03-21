---
marp: true
---

<!-- _backgroundImage: 'url(./greetings-background.png)' -->

# Introductions <!-- +5 minutes -->

- About me
  - Always wanted to build something cool
  - Started programming by building iPhone apps with friends and going to hackathons
  - Currently at Meta as an IC 4 Software Engineer
  - Got Repetitive Strain Injury and have been transitioning to voice coding for the past year. I have actually prepared this presentation without touching my keyboard
- What is a fun activity you have done last week?
- Today we will be building a multiplayer web browser version of the game called Blink

---

# Understanding Blink <!-- +8 minutes -->

- Team formation with 3-4 people
- Explain the rules and terminology (player's hand, stacks)
- Hand out cards
- Play a round with real cards

---

# Modeling the game <!-- +15 minutes to do include pictures and code references -->

- How does our game start? <!-- +5  minutes -->
- How do a player make a move? <!-- +5  minutes -->
- How does one win? <!-- +5  minutes -->

---

## How does our game start?

- Players pick a table and sit 💩, 🤡
- Players get their cards:
  - `{ 💩 : [ 🃏 1st, 🃏 2nd, 🃏 3d, ... hidden cards ]`
  - `, 🤡 : [ 🃏, ... ] }`
  - > Pro tip: `{ key: value }` data structure is called `Dictionary`
  - > Chats can be stored with it: `{ contact name: messages }`
- 2 stacks are on the table, they start with one card:
  - `Stack 1 : [ 🃏 random card ]`
  - `Stack 2 : [ 🃏 ]`
- Individual cards:
  - `{ shape: ✨, color: 🔵, shape count: 3 }`

---

## How does a player make a move?

- `Player 💩` picks `card 3`
- Player places it on top of `Stack 1`
- Others verify that at least one feature between `card 3` and `Stack 1 top card` matches
- Our table now looks like this:
- `Player 💩 : [ card 1, card 2, newly revealed card, ... hidden cards ]`
- `Stack 1 : [ card 3, random card ]`

---

## How does one win?

- When a player is out of cards
- `Player 🤡 : [ ]` We got a winner 🎉 !
  - Pro tip: `[ ]` in most languages means an empty List
- Sorry everyone who was rooting for `Player 💩`. Beware of clowns - always!

---

# Testing the game <!-- +10  minutes -->

- All go to the webpage for our game
- Get a volunteer to play a example game.
- Make sense of server logs. (Make sure the logs include all the steps from the game)
- Everyone plays an example game

---

# Changing the game <!-- +7  minutes -->

- How can we change the game? Would this change go on the client or the server?
  - Display remaining card count of other players.
  - Reveal an additional card
  - Display emoji of the player who's card is on top of the stack
  - If player makes a wrong turn, give them an extra card
- Implement the change
- Let the volunteers play the game

---

# Closing notes <!-- +3  minutes -->

- How did we apply engineering design process today?
  - Research - played the game
  - Imagine, Plan - described in plain english how the game would work
  - Create - implemented the first draft
  - Tested and improved it as a group
  - Had fun!
- Remember to stay curious and try a bunch of things

---

# Q&A <!-- +3  minutes -->

- Presentation link
- Tools used colyseus, react, ngrok
- It took me ~24 hours to prepare this
