---
marp: true
---

<!-- _backgroundImage: 'url(./greetings-background.png)' -->


# Introductions <!-- +5 minutes -->

* About me
  - Have been programming for 7 years
  - Ex Meta (Facebook) Software Engineer
  - Use my voice to code
* How does your typical class look like?

---

# Today
- Any guesses what will we do today?
* We will **play Blink, a game similar to UNO**
* **Build a website** for this game
* **Play Blink on our website**
* Improve our game

---

<!-- # What are we doing here?

* What have you been doing in this class?
* Building an online version of a game called blink
* Similar to UNO
  * Match shape, color or count of cards to play
  * But not turn based - **GO AS FAST AS YOU CAN**

--- -->

# Starting the game

- Split into groups of 2-4 people - just grab your neighbours
- Dedicate a team capitan, they will
  - Take the cards out
  - Get 2 top cards and put them on the table face up between all the players
  - Split the reamining cards roughly into equal piles for each player
- Each player should take top 3 cards from their pile
---

# Making a move

![bg right:45%](game%20state%20example.png)

* Similar to UNO 
  - Match numbers and colors to play a card
  - Who gets rid of all cards first wins
* Different from UNO
  - No turns - **GO AS FAST AS YOU CAN**
* **Which moves can you make here?**

---

![bg left](winning.jpeg)

- The first player to run out of cards wins
- Remember, there are no turns here - **GO AS FAST AS YOU CAN**
- Let's play a round!

<!-- ---

-- Replaced with the interactive demo

# Modeling the game 

What does the minimal version of our game need?

What does our player need to play?

* Ability to create and join virtual tables
* Ability to see cards on the table - `stacks`
* Ability to see their cards - `hand`
* Ability to to make a move
* Ability to know when they won or lost -->
<!-- 
---

## What will the website 👶 look like for our game?

* Supports entering a room name and user name
* **Given information** about what `stacks` are on the table, display top cards from each stack
* Display top 3 cards from user's `hand`
* Provide someway to move a card from player's `hand` to a `stack`
* Why did I highlight **given information**?
  * Because with every move the `stack` contents change!
  * How do the other players know a `stack` has changed?
  * We need a **magic server** 🧙

---

![bg right:40% w:600](client-server-model.webp)

# SERVER 🧙 WHAAT??

* 🦉 Knows everything about the game (stacks, players hands)
* 👂 Waits for players (clients) to make a move
* 👮 Verifies the move is allowed and makes it on behalf of the player
* 📢 Notifies each player that the game has changed
* 🏆 Detects when a player runs out of cards and declares them a winner


---

# Knowing everything about the game 🦉

A server is just a computer, in our case my computer is the server. How does a computer know stuff?
* Knowing `==` storing data
* What data do we need to store?
  * `Stacks` on the table
  * Cards players have

--->

---
# Lets build the web version of the game! <!-- +10  minutes -->

# Open https://www.dont-blink.app

* Oh no ... its empty! Kirill must have failed
* **Incorrect - I never fail**

---

# You will build the game yourself!
- You will tell me what our website needs to show
- It will magically 🧙 happen

<!-- Next we play the game, observe the game state, discuss logic of the game -->

---

# Changing the game <!-- +7  minutes -->

How can we change the game?
  - [Done] Display remaining card count of other players.
  - [Done] Reveal an additional card
  * Display emoji of the player who's card is on top of the stack
  * If player makes a wrong turn, give them an extra card

---

# What process does this remind you of?

--- 


![bg right:40% w:550](engineering%20design%20process%202.jpeg)

# Engineering design process:
* Explore - played the game
* Design - described in plain english how the game would work
* Create - implemented the first draft
* Try it out - tested
* Make it better - improved it as a group

---

# Q&A <!-- +3  minutes -->

![bg left:40%](entertained.jpeg)


- Tools used:
  - Language - Typescript
  - Game server - Colyseus
  - Interface - React, HTML, CSS
  - Hosting the website - Heroku 
  - Revealing UI - Firebase Realtime Database
- It took me ~40 hours to prepare this
- Presentation - https://www.dont-blink.app/presentation.html
- Source code - https://github.com/bra1nDump/do-not-blink
