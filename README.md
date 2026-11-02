# hypepilot

## Quick start with npm

Install **Node.js 24 or newer**, including npm, then extract the ZIP and open a terminal in the `hypepilot` folder containing `package.json`.

1. Install:

   ```sh
   npm install
   ```

2. Start in development mode:

   ```sh
   npm run dev
   ```

   Or start normally with `npm start` (equivalently, `npm run start`).

3. Open **http://127.0.0.1:4317/** in Chrome or Edge. Keep the terminal open; press **Ctrl+C** to stop.

Development mode restarts the server when its imported server files change. Refresh the browser after frontend edits. This project currently has no external package dependencies, so `npm install` is a setup step rather than a large dependency download. Running `npm run` by itself only lists available scripts.

Rehearsal works without credentials. Follow the OpenAI, Twitch, and OBS sections below to connect a real stream.

## UI navigation guide

### Start with the left sidebar

| Page | What it is for | What to do there |
| --- | --- | --- |
| **Live desk** (circle icon) | Your main control room | Preview the overlay, review private catches, operate promises, and try rehearsal scenarios. |
| **The ledger** (receipt icon) | Promise history and outstanding debt | Review quotes, states, witnesses, modifiers, and the evidence behind results. **Collect this debt** currently explains how to start Debt Day; it does not immediately make that debt due. |
| **Witnesses** (club icon) | Participation leaderboard | See participating viewers ranked by their imaginary collector points. This is a leaderboard, not a list of everyone watching your Twitch stream. |
| **Connections** (command icon) | Service setup and settings | Enter OpenAI/Twitch/OBS credentials, click **Save & connect**, inspect service/token/replay status, require approval for all catches, or enable/disable promise kinds. Blank credential fields retain saved values. |

At narrow window widths, sidebar labels are hidden. The icons stay in the same order: **Live desk → The ledger → Witnesses → Connections**. Widen the browser to see the full labels. The overlay and export links near the bottom of the sidebar are hidden in that compact layout.

### Find your way around the Live desk

- **Top-right mode button:** click **SIM · REHEARSAL** to switch to **LIVE TWITCH**, or click it again to return. These modes have separate saved ledgers. The green **LOCAL · CONNECTED** indicator refers to the local companion connection, not proof that Twitch or OBS is connected; inspect **Connections** for those services.
- **Enable microphone:** near the page heading. Configure OpenAI first, then click to listen in Chrome/Edge. Click the listening button again to stop. The heard transcript appears below the typed fallback field. Microphone audio uses OpenAI even in SIM mode if you enable it.
- **Four summary numbers:** open promises, outstanding debt, streamer-time exchange rate, and promises kept. They describe the currently selected mode.
- **The Stage:** preview of the overlay over a playable demo backdrop. Click the stage or press Space while not typing to jump. **Pop out** opens the transparent overlay page; it does not start a Twitch broadcast. The scene and audience number are demo visuals, not a live Twitch video feed.
- **Tab's strip:** below the stage, shows the most recent story-beat line.
- **Promise desk:** on the right on wider screens, below the stage/controls on narrower screens. Private catches appear here first, followed by active promises. Buttons change with each promise's state; see the table below.
- **Rehearsal room:** below the stage. Choose a spoken-goal, time, or vow scenario to create a SIM catch. **Reset take** restores the seeded rehearsal state, including one outstanding debt. Rehearsal controls are disabled in live mode.
- **Pause engine / Resume engine:** freezes/resumes promise timers and participation. It does not stop your Twitch broadcast or disable microphone capture. Stream online/offline reconciliation can still update lifecycle state.
- **Quiet mode:** silences Tab's outgoing Twitch chat and local notification sounds; the overlay remains active.
- **+10s rehearsal:** skips ten seconds in SIM mode. Use it to demonstrate timers and voting grace without waiting in real time.
- **Next stream / Debt Day:** simulates ending the current stream and starting another. Unpaid public promises carry over; viewers choose a debt using `!first 1`, `!first 2`, or `!first 3` during the docket vote.
- **Typed fallback + Catch that:** enter your own sentence and click **Catch that**. A detected promise is labeled **TYPED**, not presented as an automatic microphone catch.
- **The paper trail:** near the bottom, shows the latest story beats. Use **The ledger** for the wider promise history.

### Which promise button should I press?

| What you see | What to press / expect |
| --- | --- |
| **Private catch** | **Publish now** makes it public immediately. **Dismiss silently** removes it before viewers see it. Clear catches otherwise publish after 10 seconds; unclear catches wait for approval. |
| **Open / tracking goal** | Let chat or Twitch events fill the condition. **Cancel** after publication leaves a public cancellation on the record. |
| Chat has called a gameplay condition | **Confirm chat's call** makes it due. `!itsdue` alone does not prove a loss or complete the condition. |
| **DUE**, for a goal | Perform the promised action and use **Pay now / start vote** to open settlement voting. Ask real viewers to use `!paid` or `!played`, or use the rehearsal crowd buttons in SIM. |
| **CHAT IS VOTING** | Wait for the displayed vote time and the additional 25-second delay grace. In SIM, advance time after sending the votes. |
| Active time promise | **I'm back** settles the break duration and updates the exchange rate. There is no goal-settlement vote for a time promise. |
| A saved receipt is attached | **▶ Receipt** plays it through the configured OBS media source in live mode. It does not embed replay video inside the desk's demo stage. |
| A vow in SIM mode | **SIM: switch category** simulates leaving and returning to the vowed category. In live mode, actual Twitch category events supply this evidence. |

### Use the rehearsal chat controls

The **Stream chat** panel is a rehearsal input/log and local Tab activity display, not an embedded copy of your entire real Twitch chat. In live mode, viewers type in your normal Twitch channel chat.

- **Witness / Believe / Collect / Paid / Played / It's due:** each quick button sends that action from ten distinct simulated viewers over about 2.2 seconds. Let the crowd finish before advancing time.
- **Viewer dropdown + message field + up-arrow:** sends a command from one selected simulated viewer. Use this to test one-person participation, duplicate protection, bets (`!over` / `!under`), or Debt Day votes (`!first 1`).
- **Believe** always sends the word `believe`. For a custom promise that uses a different phrase, type that phrase manually in the message field.
- Crowd/message controls are disabled in **LIVE TWITCH**. Neither the broadcaster nor the bot counts as an eligible participating viewer.

For your first complete tour: **Live desk → SIM mode → Spoken Goal → Publish now → Witness → Believe → Collect → Pay now → Paid → advance beyond the full voting window → The ledger → Witnesses**. Then visit **Connections** before trying a real stream.

On a wide screen, **Open OBS overlay** near the bottom of the sidebar opens `/overlay`; **Export the receipts** downloads a JSON snapshot of the current mode's public record. The private desk is at `/dock` or `/`. Keep it out of your captured OBS sources; add only `/overlay` as the broadcast browser source.

## How hypepilot works: from microphone to Twitch chat

This example describes **LIVE TWITCH mode with OpenAI and OBS configured**. The streamer says: **“If 5 of you type believe, I'll sing.”** AI proposes the promise; code counts participation and runs the timers; viewers vote on the payoff.

| # | What happens | Who does it | Where it happens |
| --- | --- | --- | --- |
| 1 | The streamer says the promise into their microphone while listening is enabled. | Streamer; browser captures the mic | Streamer's PC, in the hypepilot desk open in Chrome or Edge. The browser captures its microphone input, not a direct system/game-audio feed. |
| 2 | Microphone speech becomes a finished text transcript. | OpenAI transcription model | Audio travels over the internet from the browser to OpenAI; the finished transcript returns to the browser and is forwarded to the local companion. |
| 3 | Cue words such as “if” and “I'll” flag the sentence for checking. Straight and curly apostrophes are accepted. | hypepilot code | Streamer's PC, in the local server. |
| 4 | The sentence is read and a structured promise form is proposed: quote, action, condition, target, confidence, and safety classification. | OpenAI extraction model | OpenAI's servers receive the sentence, recent streamer transcript, and current category from the local companion. Viewer chat is not sent to the model. |
| 5 | The proposal is checked against the transcript, supported conditions, numeric rules, confidence thresholds, and safety filters. Invalid proposals are dropped; refused ones stay private; unclear or over-cap catches require approval. | hypepilot code | Streamer's PC. These are validation checks, not a guarantee that every unsafe or sarcastic promise will be recognized. |
| 6 | A private catch appears with **Dismiss silently** and **Publish now** controls. A clear catch normally publishes after 10 seconds unless cancelled. Unclear catches, or all catches when approval is required, wait for the streamer. | Code displays it; streamer can intervene | The desk in Chrome/Edge, or a custom OBS dock for controls. Keep that panel out of the sources/scenes being broadcast. OBS dock microphone capture is not verified. |
| 7 | The promise card appears in the transparent browser-source overlay. | hypepilot, OBS, and Twitch | The local overlay updates; OBS composites it with gameplay/camera on the streamer's PC. Twitch delivers the resulting broadcast video to viewers. |
| 8 | Viewers type `!witness`; their names appear on the card. Each eligible viewer counts once within the witness window. | Viewers type; code validates and counts | Ordinary Twitch chat on viewers' devices → Twitch EventSub → local companion → OBS overlay → broadcast video. |
| 9 | Five different eligible viewers type `believe`; the bar fills to 5/5. Repeated messages from one viewer do not add extra progress. | Viewers and hypepilot code | Messages are typed in Twitch chat, counted on the streamer's PC, and reflected in the overlay. Broadcaster and bot actions do not count. |
| 10 | The goal becomes due. Tab can announce it and ping witnesses to `!collect`. If a receipt was saved successfully, OBS plays its final 15 seconds through the configured media source. | hypepilot code; OBS; Twitch chat API | OBS saves the replay at catch time, using its already-running replay buffer, and plays it at due time. Chat messages travel through Twitch. **Automatic Twitch clip creation is not implemented.** |
| 11 | The streamer performs the action and presses **Pay now / start vote** to open settlement. Viewers type `!paid` or `!played`; the result is stamped after voting closes. | Streamer, then viewers; code tallies | Performance on stream; voting in Twitch chat; tally on the streamer's PC; stamp in the OBS overlay. Voting lasts 30 seconds plus 25 seconds of delay grace. A tie favors the streamer. |
| 12 | A paid result remains on the record. A played result becomes owed; unpaid public promises are also carried forward when the stream ends or a new stream ID reveals a missed ending. | hypepilot code | Local SQLite files on the streamer's PC. A later stream can open Debt Day. Rehearsal and live records are separate. |

### What this means for setup

- **Nothing is installed inside Twitch.** Viewers need only normal Twitch chat, with no extension or download.
- The streamer runs the local companion and a Chrome/Edge desk for the microphone, connects their OpenAI/Twitch credentials, and adds the overlay to OBS. The OBS dock is optional for controls.
- Tab's public messages obey quiet mode, pause, and a six-lines-per-minute limit. An on-screen update does not guarantee that a chat announcement will also be sent.
- This is the **spoken-goal** journey. Time promises use over/under participation and a return/overtime clock, without `!collect` pings; vows use category-change evidence.
- **SIM rehearsal** scenario buttons use simulated viewers/events and a local parser. Typed fallbacks are labeled **TYPED**. If live mode has no OpenAI key, its limited local parser can process typed sentences, but microphone transcription still needs a key.
- The integration code and mocked tests support this flow; an end-to-end run with real Twitch/OpenAI/OBS accounts must still be rehearsed before recording.

## Recording fixes — 2 November 2026

- Startup and EventSub reconnect reconcile with Twitch Get Streams. A new stream ID closes stale unpaid arcs and starts Debt Day even when the prior offline event was missed; duplicate stream IDs do not age debts again.
- Curly apostrophes pass the cue filter. Innocent uses of “address” are allowed; “my address” and “home address” remain blocked.
- Time arcs announce overtime without collection pings or a collect prompt. Goal actions in Tab's due announcements are capitalized.
- OBS receipts wait for ReplayBufferSaved, serialize overlapping saves, and seek to the final 15 seconds before playback. A missing event or unavailable media duration is displayed as an error rather than using an older file.
- Twitch tokens are validated on startup and hourly. Connections displays the last check/result; failed validation closes Twitch sockets until valid credentials are available again. Automatic token refresh is still not implemented.
- Separate bot accounts use a separate EventSub socket with their own token. Subscription routing is mock-tested; rehearse with your actual two accounts before recording.
- Microphone speech turns include a 300 ms pre-roll. Run the microphone desk in **Chrome or Edge**; use the OBS dock for controls only. OBS dock microphone access has not been validated.
- Ordinary chat and duplicate/read-only commands create no new journal snapshots. Viewer records are created only when someone participates; matching goal phrases still count and persist even without a command prefix.
- Broadcast supporting text is larger, duplicate SIM labels are removed, and the Windows launcher now requires a normal Node.js 24+ installation on PATH.

Verification: **36 automated tests pass**, including mocked Twitch validation/subscription routing and OBS save/seek behavior. Live Twitch/OpenAI/OBS behavior still requires an account-connected rehearsal. Existing databases are retained and loaded without a reset.

**Say it on stream. Chat will collect.** A local Twitch companion that turns spoken promises into witnessed story arcs.

This ZIP includes the source code, Windows launcher, configuration template, and automated tests. It does not include anyone's API keys, Twitch tokens, or saved viewer data. No Twitch Extension needs to be installed, and viewers need only ordinary Twitch chat.

## 1. Set up on a fresh computer

1. Install **Node.js 24 or newer** from [nodejs.org](https://nodejs.org/). Use a normal Windows, macOS, or Linux installation; this app is not intended for an online code sandbox.
2. Extract the ZIP completely. On Windows, right-click the ZIP and select **Extract All**. Do not run the launcher from inside the ZIP preview.
3. Open the extracted `hypepilot` folder. `server.mjs`, `package.json`, and this `README.md` must be in that folder.
4. On Windows, double-click **Start hypepilot.cmd**. Keep its terminal window open while using the app. If the browser opens before the server is ready, refresh it after the terminal says **hypepilot is ready**.
5. Open [the local desk](http://127.0.0.1:4317/) in a current Chrome or Edge browser. The app starts in **SIM · REHEARSAL**.
6. Follow the demo walkthrough below. You do not need Twitch, OBS, an OpenAI account, or API credit for rehearsal.

On macOS/Linux, or if the Windows launcher is unavailable, open a terminal in the extracted folder and run the command in the next section. Run `node --version` first to confirm version 24 or newer. No `npm install` is needed: this project uses Node's built-in modules and browser APIs.

**For a real stream**, first get rehearsal working, then complete the OpenAI, Twitch, and OBS sections below. These are separate services; connecting Twitch does not automatically connect OBS or enable microphone transcription.

## Run

Requires Node.js 24+. No packages, build step, npm, or paid services are needed for rehearsal.

Double-click **Start hypepilot.cmd**, or run:

```powershell
node --env-file-if-exists=.env server.mjs
```

Open http://127.0.0.1:4317. Leave this desk open in Chrome or Edge when listening to the microphone; microphone capture inside an OBS dock is not verified. The server binds to loopback only. To stop, press Ctrl+C in the server terminal.

You can also run `npm start` from the project folder if npm is installed. The app runs on the streamer's computer, not inside Twitch. Do not expose this local control desk through a public tunnel or port forwarding.

## How hypepilot works on a real stream

Example promise: **“If five of you type believe, I'll sing.”** This describes live mode with OpenAI, Twitch, and OBS connected. Rehearsal substitutes the local phrase parser and simulated Twitch events.

| # | What happens | Who does it | Where |
| --- | --- | --- | --- |
| 1 | The streamer says the promise into their microphone. | Streamer | The streamer's computer. Keep the microphone desk open in Chrome or Edge. |
| 2 | Microphone audio becomes text. | OpenAI speech-to-text model | Audio travels over the internet to OpenAI. Final transcripts return to the browser and local companion. |
| 3 | Cue words such as “if” or “I'll” identify a sentence worth checking. | hypepilot code | The streamer's computer. Curly apostrophes are normalized for this check. |
| 4 | The sentence is read and a structured promise form is proposed. | OpenAI promise-extraction model | OpenAI receives the streamer transcript and category context. Viewer chat is not sent to the model. |
| 5 | The proposed form is checked: does the quote match the transcript, is the condition supported, are the numbers sensible, and is it safe? | hypepilot code | The streamer's computer. Invalid catches are dropped; unsafe catches are refused privately; uncertain catches wait for approval. |
| 6 | A clear catch appears privately with a Cancel button for 10 seconds. The streamer can also publish it immediately. | hypepilot code and streamer | The private desk in Chrome/Edge or the OBS control dock. Viewers do not see this panel unless it is deliberately captured on stream. |
| 7 | After the private window, the promise card appears on stream. | hypepilot, OBS, and Twitch | The local overlay is composited by OBS into the video sent to Twitch and shown on viewers' screens. |
| 8 | Viewers type `!witness`; their names fill the card. | Viewers and hypepilot code | Viewers use ordinary Twitch chat on phones or computers. Twitch forwards messages to the local companion, which counts each eligible viewer once. |
| 9 | Five different viewers type `believe`, filling the bar to 5/5. | Viewers type; hypepilot counts | Messages arrive from Twitch, are counted on the streamer's computer, and update the OBS overlay. Broadcaster and bot messages do not count. |
| 10 | The goal becomes due. Tab announces it, witnesses are prompted to `!collect`, and the saved promise receipt is replayed if configured. | hypepilot code, OBS, and Twitch | OBS plays the final 15 seconds of the local replay file through the configured media source. Tab's messages go to Twitch chat. **Automatic public Twitch clip creation is not implemented.** |
| 11 | The streamer sings and presses **Pay now / start vote**. Viewers vote `!paid` or `!played`, then the result appears on the overlay. | Streamer, then viewers; hypepilot counts | The performance is on camera; votes arrive through Twitch chat. The vote lasts 30 seconds plus 25 seconds of delay grace. A tie favors the streamer. |
| 12 | The result is recorded. A played/unpaid promise remains owed and can return during Debt Day on another stream. | hypepilot code | SQLite database files on the streamer's computer. No hosted hypepilot database is required. |

The AI proposes the initial catch. After that, counts, timers, Twitch events, streamer confirmation, and chat votes drive the outcome. **Nothing is installed inside Twitch, and viewers install nothing.**

Time promises have a different payoff: when a break runs long, Tab announces overtime without asking chat to collect. The streamer's return settles the clock and updates their exchange rate.

## A demo in three minutes

1. Stay in **SIM · REHEARSAL**. Click **Reset take**.
2. Choose **Ten believers. One jump.** The catch appears privately. Click **Publish now**, or wait the full 10 seconds.
3. Click **Witness**, then **Believe**. Ten simulated viewers sign and fill the goal through the same engine used by Twitch. All rehearsal cards carry SIM.
4. Click **Collect**. Press Space or click the stage to try a jump in the included miniature climbing scene. Click **Pay now / start vote**, then **Paid**. Advance six times with **+10s** to include the 30-second vote and its 25-second delay grace. Watch the receipt stamp.
5. Try **Back in two minutes**, publish, type `!over` or `!under`, advance time, then press **I’m back**. The measured exchange rate is saved.
6. Try **Never this game again**, publish, then **SIM: switch category**. A matching category event breaks the vow.
7. **Next stream / Debt Day** carries unpaid promises forward with playful, safe modifiers. Chat `!first 1` chooses a debt; advance nine times to close the voting window.

You can use individual rehearsal viewers to check duplicate protection. The crowd buttons send ten different viewers. The stage is an original canvas demo scene, not a Twitch video feed; the audience counter is labeled demo viewers.

## Real microphone + OpenAI

In **Connections**, enter an OpenAI API key. It stays on the local server; the browser receives a short-lived Realtime credential. Extraction defaults to `gpt-4.1-mini`, transcription to `gpt-live-transcribe`; both are configurable.

1. Create your own API key in the [OpenAI API dashboard](https://platform.openai.com/api-keys). API usage requires available credit/billing on that API project; a ChatGPT subscription is separate.
2. In the local desk, select **Connections**, paste the key under **OpenAI**, and click **Save & connect** at the bottom of the form. Leave model fields blank to use the defaults, or select model IDs available to your API project.
3. Return to **Live desk** and click **Enable microphone**. Allow microphone access in your browser. Use a headset so game audio and other speakers are less likely to enter the microphone.
4. Switch to **LIVE TWITCH** to use AI promise extraction. Rehearsal deliberately keeps its local phrase parser even when an API key is configured.
5. Try saying: **If ten of you type believe, I'll try the jump.** A private catch should appear in the promise desk. Cancel it, approve it, or let the 10-second window expire.

Microphone audio is sent to OpenAI when listening is enabled, including while the app is in rehearsal. Click the listening button again to stop capture. Use the scenario buttons instead if you want a rehearsal with no microphone/API usage.

Click **Enable microphone** and allow microphone access. The client captures only the selected microphone as 24 kHz mono PCM, uses a local energy detector to commit completed speech turns, and sends audio directly to OpenAI Realtime. Final transcripts go to the local server. Live mode uses the Responses API with strict structured outputs. Chat text never goes to OpenAI. Transcripts remain in memory for 60 seconds; caught quotes are persisted. Say “I’m back” to settle a running time arc.

Rehearsal uses a deterministic phrase parser to avoid API costs and make demos repeatable. Live mode uses AI when a key is present; without a key the limited local parser remains available for typed/microphone transcript fallback. Typed input is visibly labeled TYPED. The UI does not pretend that rehearsal phrases are AI detections.

## Real Twitch

Register a Twitch application in the Twitch developer console. Add the Client ID and user access tokens in Connections. Make the bot a moderator.

### Register your own Twitch app

1. Sign into the [Twitch developer console](https://dev.twitch.tv/console) as the broadcaster. Verify your email and enable two-factor authentication if required.
2. Go to **Applications → Register Your Application**. Give the application a unique name and choose a suitable category such as a chatbot/application integration.
3. Add **`http://localhost:4317/`** as an OAuth redirect URL, with the trailing slash. The URL used during authorization must match the registered value exactly.
4. For the manual implicit-token procedure below, use a **Confidential** client if the console asks for client type. Twitch's Public clients are restricted to its device-code flow. Do not put a client secret into this app; this manual procedure only uses the Client ID.
5. Open the application's **Manage** page and copy its **Client ID**.

### Obtain a user access token: simplest single-account setup

This build accepts an existing user access token. It does not include a one-click OAuth login or automatic token refresh. The following manual procedure uses [Twitch's documented implicit grant](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow).

1. Keep the local server running. Open PowerShell and run the following commands, replacing `PASTE_YOUR_CLIENT_ID` with your application's Client ID. The script opens Twitch's authorization page; it does not ask for or transmit a client secret.

```powershell
$hypepilotClientId = 'PASTE_YOUR_CLIENT_ID'
$hypepilotState = [guid]::NewGuid().ToString('N')
$hypepilotRedirect = [uri]::EscapeDataString('http://localhost:4317/')
$hypepilotScopes = [uri]::EscapeDataString('moderator:read:followers user:read:chat user:write:chat')
$hypepilotAuthUrl = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=$hypepilotClientId&redirect_uri=$hypepilotRedirect&scope=$hypepilotScopes&state=$hypepilotState&force_verify=true"
Write-Host "Expected returned state: $hypepilotState"
Start-Process $hypepilotAuthUrl
```

2. Sign into your **broadcaster account**, review the requested permissions, and authorize your own application.
3. Twitch redirects to a URL shaped like `http://localhost:4317/#access_token=...&scope=...&state=...&token_type=bearer`. The desk does not automatically import this token.
4. Check that the returned `state` matches the value printed in PowerShell. If it does not, discard the response. Copy only the value after `access_token=` and before the next `&`. Do not copy the entire URL, and do not add `Bearer ` or `oauth:`.
5. In the desk's **Connections** page, fill **Client ID** and **Broadcaster access token**. Leave **Bot access token** blank for this single-account setup. Click **Save & connect**.
6. Replace the token-bearing address in the browser with `http://127.0.0.1:4317/`. Do not share the callback URL, token, or screenshots containing either.
7. Check **Connections** for **TWITCH: Connected** and **6 subscriptions active**. Switch the top-right mode selector to **LIVE TWITCH**.

For macOS/Linux, construct the same authorization URL using your Client ID, the exact registered redirect, URL-encoded scopes, and a fresh random state. Open it in a browser and follow steps 2–7. The PowerShell example is provided for the Windows demo setup.

### Optional separate Tab/bot account

Authorize the same Client ID while logged into the bot account, requesting `user:read:chat user:write:chat`, and enter that resulting token in **Bot access token**. Keep the broadcaster token, with `moderator:read:followers`, in its own field. In your Twitch channel's chat, use `/mod YOUR_BOT_LOGIN` to make the bot a moderator. Use the same Twitch application's Client ID for both tokens.

### Confirm the real chat interaction

1. Start a normal Twitch broadcast from OBS when you are ready to test on air.
2. Keep the desk in **LIVE TWITCH** and publish a caught promise such as **If two of you type believe, I'll try the jump**.
3. Ask two real viewers to type `!witness`, then `believe` in your channel's normal Twitch chat. Broadcaster/bot messages intentionally do not count, so do not test participation solely from those accounts.
4. Confirm that their signatures and the goal progress appear in the desk/overlay. When due, viewers can type `!collect`.
5. Perform the action, press **Pay now / start vote**, and ask viewers to type `!paid` or `!played`. Wait for the full 30-second voting window plus 25 seconds of stream-delay grace.
6. If a connection fails, inspect **Connections**. Expired tokens must be replaced manually using the authorization procedure again.

- Broadcaster token: `moderator:read:followers`.
- Bot token: `user:read:chat` and `user:write:chat`.
- The broadcaster account can also serve as the bot for a simple single-account setup; grant all three scopes on its token and leave the bot token blank.

The adapter validates tokens, reads the current category, connects to EventSub WebSockets, and subscribes to chat, follows, raids, category updates, and stream online/offline. Separate bot identities use a separate WebSocket. Get Streams reconciles lifecycle state at startup and reconnect, and tokens are revalidated hourly. Subscription failures are shown in Connections instead of being concealed. Tokens must belong to the registered Client ID. Switch the top-right mode selector to **LIVE TWITCH**. Live and rehearsal have independent SQLite files.

Supported chat: `!witness`, the caught phrase, `!collect`, `!itsdue`, `!paid`, `!played`, `!over`, `!under`, `!first 1` (or 2/3), `!tab`, `!vows`, `!record`, `!exchange`, `!rank`, `!forgetme`.

Chat never decides a gameplay outcome by itself. `!itsdue` requires streamer confirmation. Each witness, goal participant, collector, bet, and vote is unique by Twitch user ID. Broadcaster and bot actions do not count. Windows include 25 seconds of delay grace. Votes are final after grace; ties favor the streamer. Tab sends at most six chat messages per minute and quiet mode silences them.

## OBS

1. Enable WebSocket Server in OBS → Tools → WebSocket Server Settings (OBS 28+). Set a password.
2. In Connections set `ws://127.0.0.1:4455`, the password, and your BRB scene name.
3. Enable Replay Buffer in OBS Output settings. Set it to 60 seconds.
4. Add a **Browser Source** using http://127.0.0.1:4317/overlay at **1920 × 1080**, with transparent background.
5. Add a custom browser dock using http://127.0.0.1:4317/dock.
6. Optionally create an OBS Media Source named **hypepilot Receipt**. The adapter saves a replay on live catches; **▶ Receipt** in the desk points the media source at that file and plays it. Arrange the media source in your scene. Leaving your BRB scene settles running time promises.

In OBS, use **Sources → + → Browser** to add the overlay. Under **Docks → Custom Browser Docks**, give the dock a name such as **hypepilot** and enter its URL. Menu wording can vary by OBS version. Keep the companion server running while OBS uses either URL. Do not enable a browser source option that shuts the overlay down when hidden if you want uninterrupted display updates.

The replay buffer must be configured before the adapter can start it. Ensure OBS has a writable recording folder. If you change the media source name or BRB scene name, put the exact same names into Connections and save again. If no receipt replays, use the normal promise card for the demo and check OBS/replay status before trying again.

## Configuration alternative: .env

The Connections screen is the easiest setup path. Alternatively, copy `.env.example` to `.env` in the same folder as `server.mjs`, fill in your own values, then start with the documented command or launcher.

```powershell
Copy-Item .env.example .env
```

On macOS/Linux, use `cp .env.example .env`. Never share the completed `.env` file. The included `.env.example` has no credentials.

| Variable | Purpose | Default / note |
| --- | --- | --- |
| `PORT` | Local HTTP port | `4317`; restart after changing |
| `OPENAI_API_KEY` | Your OpenAI API key | Required for microphone sessions and live AI extraction |
| `OPENAI_MODEL` | Promise extraction model | `gpt-4.1-mini` |
| `TRANSCRIPTION_MODEL` | Realtime transcription model | `gpt-live-transcribe` |
| `TWITCH_CLIENT_ID` | Your registered Twitch application | Must match the app that issued both tokens |
| `TWITCH_BROADCASTER_TOKEN` | Broadcaster user access token | No `Bearer`/`oauth:` prefix |
| `TWITCH_BOT_TOKEN` | Optional separate bot user access token | Blank uses broadcaster token |
| `OBS_URL` | OBS WebSocket server | Local `ws://127.0.0.1:4455` |
| `OBS_PASSWORD` | OBS WebSocket password | Match OBS settings |
| `OBS_BRB_SCENE` | Scene that indicates a break | `BRB` |
| `OBS_RECEIPT_SOURCE` | Media source for receipts | `hypepilot Receipt` |

Settings previously saved through Connections take precedence over matching environment values. Blank form fields retain saved settings. To start with entirely new connections, stop the server, move `data/connections.json` to a private backup outside the project, and restart. Changing `PORT` also requires using that port in browser/OBS URLs and, if applicable, your OAuth redirect registration. The Windows launcher's browser shortcut uses port 4317; open your custom port manually.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `node` is not recognized | Install Node.js 24+, reopen the terminal, and check `node --version`. |
| Missing `node:sqlite` or unsupported Node flags | The Node version is too old; upgrade to 24+. |
| Browser says the site cannot be reached | Keep the server terminal open, confirm its ready message, then refresh `http://127.0.0.1:4317/`. |
| `EADDRINUSE` | Another copy is already running on the port. Use that copy, stop it, or set a different `PORT` in `.env`. |
| `Cannot find ... server.mjs` | Extract the full ZIP and run from the `hypepilot` directory, not its parent. |
| Rehearsal does not use AI | Expected: SIM mode uses the local parser. Live mode uses AI when a key is present. |
| Microphone permission denied | Allow microphone access for the local site in browser settings, select the right input device, and try again. |
| OpenAI session/model error | Check API key, API-project billing, and model access. Read the visible error; model availability depends on the account. |
| Twitch redirect mismatch | Register the exact redirect `http://localhost:4317/` and use it unchanged in authorization. |
| Twitch 401/403 or subscription errors | Check token expiry, required scopes, account ownership, and matching Client ID. Replace invalid tokens and save again. |
| My own chat messages do not count | Broadcaster and bot are excluded. Test with real viewers or use simulated viewers in SIM mode. |
| OBS disconnected | Enable its WebSocket server and check local URL, port, and password. |
| Overlay is blank | Confirm the server is running, use `/overlay`, and publish a catch. Private catches deliberately do not appear publicly. |
| Vote appears to finish late | Every vote allows 25 additional seconds for viewers watching delayed video. |
| Reset take does not clear the live ledger | Expected: reset applies only to the separate rehearsal database. |

## Sharing and project contents

Share this clean ZIP, or copy only the source files below. Each recipient should use their own credentials. **Do not re-zip the generated `data/` directory or a completed `.env`.** The app creates `data/` automatically on first launch.

```text
hypepilot/
  README.md                 Setup, walkthrough, and limitations
  Start hypepilot.cmd   Windows launcher
  package.json              Optional start/test commands
  .env.example              Credential-free configuration template
  .gitignore                Excludes credentials and local data
  server.mjs                Local server, API, storage, detection
  engine.mjs                Promise rules and state transitions
  integrations.mjs          Twitch and OBS adapters
  public/                   Desk, overlay, styles, playable scene
  test/                     Automated engine tests
```

The stage inside the desk is an illustration/playable rehearsal scene. Your real gameplay and camera remain normal OBS sources behind the transparent overlay.

## What is implemented

- Private catch window, approval bands, public cancellation, enabled-kind settings, pause/resume and quiet mode.
- Spoken chat/follow/raid goals, unique participation, witnessed receipt cards, collection and settlement votes.
- Streamer-time clock, virtual over/under bets, measured median exchange rate and return controls.
- Category vows, matching category evidence and stream-end vow completion.
- Cross-stream debts, three safe interest modifiers, Debt Day docket and unique priority votes.
- SQLite append-only event journal with stored state projections; reload and restart recovery.
- Independent SIM/live ledgers, time travel controls restricted to SIM, export, leaderboard and viewer removal from current projections.
- Local-only server, Host/Origin/CSRF checks, secret-free state responses, escaped rendered text.

## Practical limits before recording on real Twitch

The offline rehearsal is verified with automated journey tests. Real OpenAI, Twitch, and OBS require your credentials and a local rehearsal; these integrations have not been validated against your accounts. Existing access tokens are accepted; automatic OAuth onboarding and refresh are not implemented, so renew expired tokens in Connections. Twitch paired public clips, stream markers, replay-file retention cleanup, named-category search/ambiguity resolution, and a formal 80-line extraction evaluation are not implemented. Subscription/Bits checkers exist in the engine but are not subscribed by the adapter. The basic voice parser does not resolve named game vows; AI extraction can use names but exact category matching is required.

The event journal contains historical state, so `!forgetme` removes current viewer projections but does not erase older event snapshots. Do not claim complete historical erasure. Delete the local databases if you need to erase all recorded data. Replays are managed by OBS and should be cleaned up manually. Pause freezes engine deadlines and ignores incoming actions; it does not pause your stream or stop microphone network capture. No latency/precision/recall targets are claimed without measurements.

Keys are saved locally to `data/connections.json` (or read from `.env`). Treat this folder as private. Never publish it; `.gitignore` excludes it. To distribute this project, exclude `data/` and `.env`. No messages are sent to Twitch while rehearsing; live adapters can receive real events into the separate live ledger once connected.

## Verification

```powershell
node --test test/*.test.mjs
```

The tests cover cancellation, quote validation, safety refusal, unique actions, excluded broadcaster, delay grace, goal completion, duplicate follows, confirmed calls, verdicts, streamer time, vows, Debt Day, restart recovery, pause, forget and approval holds.

## Integration references

- [OpenAI Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)
- [Twitch EventSub WebSocket messages](https://dev.twitch.tv/docs/eventsub/handling-websocket-events/)
- [OBS WebSocket v5 protocol](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md)

The document is the product specification; submission and eligibility guidance in it is background, not a request to enter or publish the project.

Documentation checked for these fixes: [Twitch token validation](https://dev.twitch.tv/docs/authentication/validate-tokens/), [EventSub WebSocket handling](https://dev.twitch.tv/docs/eventsub/handling-websocket-events/), [OBS WebSocket protocol](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md).
# HypePilot
