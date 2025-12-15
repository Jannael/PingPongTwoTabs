# Ping Pong Two Tabs

A unique experimental Ping Pong game that runs across two separate browser windows. The game uses `localStorage` to synchronize the ball position, player movements, and game state between the two windows in real-time, effectively treating your dual-window setup as a single extended screen.

## How it Works

The application relies on the browser's `localStorage` API to bridge the communication gap between the two separate windows (tabs).

1.  **State Synchronization**:
    *   **Page 1 (Master)**: Handles the player's paddle inputs and the physics calculations for the ball. It continuously writes the ball's coordinates (`ballPositionTop`, `ballPositionLeft`) to `localStorage`.
    *   **Page 2 (Slave/Bot)**: Reads the ball's coordinates from `localStorage` to render the ball on its side. It also handles the "Bot" logic if a CPU opponent is selected.
2.  **Screen Extension**:
    *   On startup, the script calculates the `totalWidth` by summing the `innerWidth` of both windows (stored in `localStorage`).
    *   This allows the ball to travel physically from one window to the other, creating a continuous playing field.

## Setup & How to Play

> [!WARNING]
> **Important Limitation**: Due to the way browsers handle window sizing and initialization, the startup process is manual and specific. Please follow the steps below exactly to ensure the game works correctly.

### Step-by-Step Instructions

1.  **Start the Game Application**: Open the `index.html` file in your browser to load the main menu.
2.  **Open the Second Window**: interact with the game (click Play/Select Difficulty) to trigger the opening of the **second tab**.
3.  **Position the Windows**:
    *   Drag the **second tab** (the new one) out and use `Windows Key` + `Right Arrow` to snap it to the right half of your screen.
    *   Select your **original tab** (the first one) and use `Windows Key` + `Left Arrow` to snap it to the left half of your screen.
4.  **Restart Both Windows**:
    *   **Crucial Step**: Once both windows are positioned side-by-side, **refresh (F5)** BOTH the left and right windows. This ensures the game calculates the correct screen width for the play area.
5.  **Select Difficulty**:
    *   On the left window (Page 1), play the game/select your difficulty again.
    *   **Note**: Because the game logic triggers `window.open` here, a **new (third) tab will open**.
    *   **Close the extra tab**. You don't need it since you already have your right-side window open and ready. You can identify the correct second window by looking for the number `2` in the URL (e.g., `index.html?2`).
6.  **Play**: The game should now be running across both monitors/halves of your screen!

## Controls

*   **W**: Move Paddle Up
*   **S**: Move Paddle Down

## Limitations

*   **Complex Startup**: As noted above, the game requires a manual setup of window positions and refreshes to ensure the coordinate system is mapped correctly to your screen usage.
*   **Performance**: Since `localStorage` events are used for synchronization, the smoothness of the ball on the second screen depends on the browser's storage event firing rate, which is generally fast but not as smooth as a native canvas render.