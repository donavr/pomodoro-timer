# Focus Timer

A simple, responsive Pomodoro timer that helps you alternate focused
work with refreshing breaks.

Built with HTML, CSS, and vanilla JavaScript. No dependencies,
installation, accounts, or build tools required.

## Live demo

[Open Focus Timer](https://YOUR_USERNAME.github.io/pomodoro-timer/)

Replace `YOUR_USERNAME` with your GitHub username after deployment.

## Features

- 25-minute focus sessions
- 5-minute short breaks
- 15-minute long breaks
- Start, pause, resume, and reset controls
- Session progress indicator
- Remaining time displayed in the browser tab
- Responsive layout for desktop and mobile
- Keyboard-accessible controls

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.

Alternatively, if Python is installed, run this command from the
project folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

On systems where Python uses the `python3` command, run:

```bash
python3 -m http.server 8000
```

## How to use

1. Select Focus and press Start.
2. Work on a single task for 25 minutes.
3. Select Short break when the session ends.
4. After four focus sessions, select Long break.
5. Use Pause or Reset whenever needed.

Sessions are selected manually and do not start automatically.

## Project structure

- `index.html`: page content and accessible controls
- `styles.css`: responsive layout and visual styling
- `script.js`: timer state, controls, and countdown logic
- `.gitignore`: files excluded from version control
- `README.md`: project documentation

## Customize durations

Open `script.js` and edit the `seconds` value for each mode in the
`modes` object.

For example, a 50-minute focus session uses:

```javascript
seconds: 50 * 60
```

## Deploy with GitHub Pages

1. Push the project to a GitHub repository.
2. Open the repository's Settings → Pages.
3. Choose Deploy from a branch.
4. Select the main branch and /(root) folder.
5. Click Save.
6. Open the published URL when deployment finishes.

## Limitations

- Refreshing or closing the page resets the timer.
- Sleeping devices and suspended tabs may delay updates.
- Completion is shown visually; there is no sound or system notification.
- Changing modes resets the current session.
- Changing the device clock can affect a running countdown.

## Privacy

The app does not collect data, use analytics, or send application data
to a server.