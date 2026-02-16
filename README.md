--- Memory Maze
Memory Maze is a browser-based memory card game where players flip cards to find matching pairs. It tracks the number of cards revealed and the time taken, and allows players to save their score to a database. The images that are displayed in the game are stored and fetched from the database.

--- Features:

- Dynamic grid size (3×3 up to 5×5)
- Flip cards to find matching pairs
- Timer to track game duration
- Cards revealed counter
- Confetti animation on game completion
- Save your score with player name
- Responsive design for desktop and mobile
- upcoming feature

--- Tech Stack:

- Frontend: HTML, CSS, JavaScript (ES6 modules)
- Backend: Node.js, Express.js, SQLite (via Knex.js)
- Animations: Canvas Confetti library
- API: REST endpoints to fetch card images and save scores

--- Code Organization:

The JavaScript is split into three separate files to keep things clear and easy to work with:

- script.js: Handles DOM interactions, grid controls, and game initialization
- functions.js: Contains the main game logic like flipping cards, creating the grid, timer, restart and ending the game
- server.js: Runs the backend to provide images and save scores
  This makes the code easier to read, understand, and update.

--- Trello Project Management:

Link: https://trello.com/u/shiprasrivastava2/boards

We used Trello board to organize development of our Memory maze game.
Backlog: Planned features and ideas for future development
Sprint 1 / Sprint 2: Tasks selected from the backlog and actively worked on during each sprint
In Progress: Tasks currently being worked on
Done: Completed features and bug fixes
MoSCoW Method: Tasks were prioritized as Must have, Should have, Could have, and Won’t have to know what to focus on first.
Using this workflow helped us to stay organized, assign responsibilities, and track progress throughout the project.
