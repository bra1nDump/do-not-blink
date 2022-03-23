---
marp: true
---

<!-- _backgroundImage: 'url(./greetings-background.png)' -->

# Introductions <!-- +5 minutes -->

* About me
  * Have been programming for 7 years
  * Currently at Meta as a Software Engineer
  * Use my voice to code
* What do you do in this class?
* Today we will be building a multiplayer web browser version of the game called Blink
* Lets first try playing the table version!

---

# What are we doing here?

* What have you been doing in this class?
* Building an online version of a game called blink
* Similar to UNO
  * Match shape, color or count of cards to play
  * But not turn based - **GO AS FAST AS YOU CAN**

---

# Starting

* Split into groups of 2-3 people - just grab your neighbours
* Dedicate a team capitan, they will
  * Take the cards out
  * Get 2 top cards and put them on the table face up between all the players
  * Split the reamining cards roughly into 2-3 parts depending on number of players in your group
---

# Moving

![bg right:45%](game%20state%20example.png)

- You can play a card from your `hand` to a `stack`
- **If your card matches one of the features (shape, color or count)** of the card on top of a `stack`
- Which moves can you make here?

---

![bg left](winning.jpeg)

- The first player to run out of cards wins
- Let's play a round!

---

# Modeling the game <!-- +15 minutes to do include pictures and code references -->

What does the minimal version of our game need?

What does our player need to play?

* Ability to create and join virtual tables
* Ability to see cards on the table - `stacks`
* Ability to see their cards - `hand`
* Ability to to make a move
* Ability to know when they won or lost

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

---
# Trying it out! <!-- +10  minutes -->

# Go to http://notblink.herokuapp.com/
- With your team decide on a room name and enter in the text box
- Choose your warriors (cannot join with the same user)
- Once everyone is in start the game
- If you have any problems - ASK
---

# Changing the game <!-- +7  minutes -->

How can we change the game? Would this change go on the client 👶 or the server 🧙?
  * Display remaining card count of other players.
  * Reveal an additional card
  * Display emoji of the player who's card is on top of the stack
  * If player makes a wrong turn, give them an extra card

---

# Closing notes <!-- +3  minutes -->

![bg right:40% w:550](engineering%20design%20process%202.jpeg)

* How did we apply engineering design process today?
  * Explore - played the game
  * Design - described in plain english how the game would work
  * Create - implemented the first draft
  * Try it out - tested
  * Make it better - improved it as a group

---

# Q&A <!-- +3  minutes -->

![bg left:40%](entertained.jpeg)

- Presentation link
- Tools used colyseus, react, ngrok
- It took me ~24 hours to prepare this
