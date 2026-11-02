# hypepilot

**Say it on stream. Chat will collect.**

hypepilot turns a streamer's spoken promises into interactive moments for Twitch chat. Viewers witness promises, help meet their conditions, and vote on whether they were kept. Unpaid promises can return next stream as **Debt Day**.

The app runs on the streamer's computer alongside OBS. Nothing is installed inside Twitch, and viewers participate through ordinary chat messages.

[Quick start](#quick-start) · [Rehearsal](#try-a-complete-rehearsal) · [UI guide](#navigate-the-ui) · [Live setup](#connect-a-real-stream) · [Configuration](#configuration) · [Troubleshooting](#troubleshooting)

## Requirements

- **Node.js 24 or newer**, including npm: [download Node.js](https://nodejs.org/).
- **Chrome or Edge** for the desk and microphone capture.
- For a real stream: **OBS Studio 28+**, a Twitch account/application, and an OpenAI API key with available API credit and access to the configured models.

Rehearsal works without OBS, Twitch credentials, an OpenAI key, or microphone access.

## Quick start

1. Extract the ZIP completely and open a terminal in the `hypepilot` folder containing `package.json`.
2. Run:

   ```sh
   npm install
   npm run dev
   ```

3. Open [http://127.0.0.1:4317/](http://127.0.0.1:4317/) in Chrome or Edge.
4. Leave the terminal open while using the app. Press **Ctrl+C** to stop it.

The app starts in **SIM · REHEARSAL**. It currently uses no external npm packages; `npm install` is included as the standard setup step.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start with automatic restart when imported server files change. Refresh the browser after frontend edits. |
| `npm start` | Start normally. |
| `npm test` | Run the automated test suite. |

On Windows, you can also double-click **Start hypepilot.cmd** after installing Node.js. If the browser opens before the server is ready, wait for the terminal's ready message and refresh.

To run without npm:

```sh
node --env-file-if-exists=.env server.mjs
```

## Try a complete rehearsal

1. On **Live desk**, keep **SIM · REHEARSAL** selected. Click **Reset take** for a fresh rehearsal with one seeded debt.
2. Choose **Ten believers. One jump.** A private catch appears in the **Promise desk**.
3. Click **Publish now**, or wait ten seconds for the clear catch to publish.
4. Click **Witness**, wait for the simulated crowd to finish, then click **Believe**. Ten distinct simulated viewers sign and fill the goal.
5. Once the promise is due, click **Collect**. Click the demo stage or press Space while not typing to try the jump.
6. Click **Pay now / start vote**, then **Paid**. Wait for the crowd to finish voting before advancing time.
7. Use **+10s rehearsal** until the 30-second voting window and 25-second delay grace have both passed. The result is stamped on the overlay.
8. Open **The ledger** to review the promise and **Witnesses** to see participation points.

Other scenarios:

- **Back in two minutes:** publish, send `!over` or `!under` from a selected rehearsal viewer, advance time, then click **I'm back** to settle the clock.
- **Never this game again:** publish, then use **SIM: switch category** to demonstrate a broken vow.
- **Next stream / Debt Day:** simulate a new stream, send `!first 1`, `!first 2`, or `!first 3`, and advance beyond the 60-second docket window plus 25-second grace.

Rehearsal uses a local phrase parser and simulated Twitch events. Its cards are labeled **SIM**. The playable stage and audience number are demo visuals, not a Twitch video feed.

## Navigate the UI

### Sidebar pages

| Page | Purpose |
| --- | --- |
| **Live desk** — circle icon | Overlay preview, private catches, active promises, rehearsal controls, and typed fallback. |
| **The ledger** — receipt icon | Promise history, outcomes, evidence, and outstanding debts. **Collect this debt** currently directs you to Debt Day rather than collecting immediately. |
| **Witnesses** — club icon | Participating viewers ranked by imaginary points. |
| **Connections** — command icon | Service credentials and status, approval settings, and enabled promise types. |

On narrow screens, sidebar labels are hidden but the icons remain in that order. Widen the browser to see labels and the **Open OBS overlay** and **Export the receipts** links.

### Live desk controls

| Control or area | How to use it |
| --- | --- |
| **SIM · REHEARSAL / LIVE TWITCH** | Top-right button switches between separate rehearsal and live ledgers. Simulation controls are disabled in live mode. |
| **LOCAL · CONNECTED** | Confirms connection to the local server. Check **Connections** for Twitch, OpenAI, and OBS status. |
| **Enable microphone** | Starts listening after OpenAI is configured. Click again to stop. Keep this desk open in Chrome/Edge. |
| **The Stage / Pop out** | Previews the overlay or opens `/overlay`. This does not start broadcasting. |
| **Promise desk** | On the right in wide layouts and below the main controls in narrow layouts. Review private and active promises here. |
| **Publish now / Dismiss silently** | Publish a private catch immediately or cancel it before it appears publicly. Unclear catches wait for approval. |
| **Cancel** | Cancels an already-public promise and records its cancellation. |
| **Confirm chat's call** | Confirms a condition proposed through `!itsdue`; the command alone cannot make it due. |
| **Pay now / start vote** | Opens settlement voting for a due goal after the promised action. |
| **I'm back** | Settles a running time promise. Time promises do not use goal-settlement votes. |
| **▶ Receipt** | Plays an attached replay through the configured OBS media source in live mode. |
| **Pause engine / Resume engine** | Freezes/resumes promise timers and participation. Stream lifecycle reconciliation can still update state. This does not stop your broadcast or disable the microphone. |
| **Quiet mode** | Silences Tab's outgoing Twitch chat and local notification sounds; overlay updates continue. |
| **Typed fallback / Catch that** | Detects a promise from text you enter; the card is labeled **TYPED**. |
| **The paper trail** | Shows recent story beats. Use **The ledger** for promise history. |

The **Stream chat** panel is a rehearsal input/log and local Tab activity display, not a full embedded Twitch chat. Quick buttons send actions from ten simulated viewers over about 2.2 seconds. The viewer dropdown and message field send one viewer's message. **Believe** always sends `believe`; type a different phrase manually for custom goals. In live mode, use your normal Twitch chat.

## Connect a real stream

Complete the three setup sections below, then select **LIVE TWITCH**. Keep the microphone desk in Chrome/Edge. The OBS dock is optional for controls; microphone capture inside an OBS dock is not verified.

### 1. OpenAI and microphone

1. Create an API key in the [OpenAI API dashboard](https://platform.openai.com/api-keys). API billing/credit is separate from a ChatGPT subscription.
2. Open **Connections**, enter the key, and click **Save & connect**. The model defaults are `gpt-4.1-mini` for extraction and `gpt-live-transcribe` for transcription; configure model IDs available to your API project if needed.
3. Return to **Live desk**, select **LIVE TWITCH**, click **Enable microphone**, and allow browser microphone access.
4. Say: **“If five of you type believe, I'll sing.”** Review the resulting private catch. Clear catches normally publish after ten seconds unless dismissed; **Connections** can require approval for every catch.

Microphone audio is sent to OpenAI while listening is enabled, including in SIM mode. Click the listening button to stop. Use the rehearsal scenario buttons for a microphone-free, API-free demo.

### 2. Twitch

#### Register an application

1. Sign into the [Twitch developer console](https://dev.twitch.tv/console). Verify your email and enable two-factor authentication if required.
2. Under **Applications**, register an application with a unique name and a suitable category.
3. Register **`http://localhost:4317/`** as an OAuth redirect URL, including the trailing slash.
4. For the manual implicit-grant procedure below, use a **Confidential** client if asked for client type. Twitch Public clients use the device-code flow instead. This app does not require a client secret for the procedure below.
5. Copy the application's **Client ID** from its Manage page.

#### Authorize a single-account setup

Keep the local server running. In PowerShell, replace the Client ID placeholder and run:

```powershell
$hypepilotClientId = 'PASTE_YOUR_CLIENT_ID'
$hypepilotState = [guid]::NewGuid().ToString('N')
$hypepilotRedirect = [uri]::EscapeDataString('http://localhost:4317/')
$hypepilotScopes = [uri]::EscapeDataString('moderator:read:followers user:read:chat user:write:chat')
$hypepilotAuthUrl = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=$hypepilotClientId&redirect_uri=$hypepilotRedirect&scope=$hypepilotScopes&state=$hypepilotState&force_verify=true"
Write-Host "Expected returned state: $hypepilotState"
Start-Process $hypepilotAuthUrl
```

1. Sign into the **broadcaster account** and authorize the requested permissions.
2. Twitch redirects to `http://localhost:4317/#access_token=...&scope=...&state=...&token_type=bearer`. Confirm that the returned `state` matches the value printed in PowerShell; discard a response that does not match.
3. Copy only the token value between `access_token=` and the following `&`. Do not include `Bearer ` or `oauth:`.
4. In **Connections**, enter the **Client ID** and **Broadcaster access token**. Leave **Bot access token** blank so the broadcaster also sends Tab's messages. Click **Save & connect**.
5. Replace the callback address with `http://127.0.0.1:4317/`. Do not share the token-bearing URL.
6. Check **Connections** for Twitch connection status, token validation, and **6 subscriptions active**. Switch to **LIVE TWITCH**.

The app accepts pasted user tokens; it does not automatically import the callback token or refresh expired tokens. Validation runs on startup and hourly. Replace expired tokens in **Connections**.

On macOS/Linux, use [Twitch's implicit-grant instructions](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow) with the same Client ID, exact registered redirect, URL-encoded scopes, and a fresh random state; then follow the token-copy steps above.

#### Optional separate Tab account

Authorize the **same Client ID** as the bot account with `user:read:chat user:write:chat`, and paste its token into **Bot access token**. The broadcaster token needs `moderator:read:followers`. In your channel's Twitch chat, run `/mod YOUR_BOT_LOGIN`. Each account uses its own EventSub socket when the identities differ.

### 3. OBS

1. In OBS, open **Tools → WebSocket Server Settings**, enable the server, and set a password.
2. In hypepilot **Connections**, set the URL to `ws://127.0.0.1:4455`, enter that password, and set your BRB scene name. Save the connection.
3. Add a **Browser Source** under **Sources → + → Browser**:

   - URL: **http://127.0.0.1:4317/overlay**
   - Width: **1920**; height: **1080**
   - Background: transparent

4. Optionally add **http://127.0.0.1:4317/dock** under **Docks → Custom Browser Docks** for private controls. Keep the desk/dock out of your captured stream sources.
5. For replay receipts, enable OBS **Replay Buffer** in Output settings, set its duration to 60 seconds, and ensure the recording folder is writable. Reconnect hypepilot after configuring it so the adapter can start the buffer.
6. Add a **Media Source** named **hypepilot Receipt** and arrange it in the scene. Use the same source name in **Connections**. Live catches save a replay; due goals can play its final 15 seconds. **▶ Receipt** also plays an attached receipt manually.

Keep the local server running while OBS uses the overlay or dock. The demo stage in the desk does not replace your actual gameplay or camera sources. Leaving the configured BRB scene can register your return for a time promise.

### Check the live interaction

Publish a small goal, such as **“If two of you type believe, I'll sing.”** Ask two real viewers to type `!witness`, then `believe`, in your Twitch channel. Check the overlay progress, perform the action, and click **Pay now / start vote**. Have viewers vote and wait for the full 30-second window plus 25-second delay grace.

The broadcaster and bot are excluded from participation, so their own messages cannot verify the viewer-counting flow. **LOCAL · CONNECTED** alone does not confirm the external services are connected.

## Chat commands

| Message | Purpose |
| --- | --- |
| `!witness` | Sign during the witness window. |
| The caught goal phrase, such as `believe` | Contribute once per viewer toward that goal. |
| `!collect` | Join collection of a due goal. |
| `!itsdue` | Propose a gameplay condition for streamer confirmation. |
| `!paid` / `!played` | Vote during settlement. Ties favor the streamer. |
| `!over` / `!under` | Choose a side during a time promise's betting window. Points have no cash value. |
| `!first 1`, `!first 2`, `!first 3` | Choose a displayed Debt Day item. |
| `!tab` / `!vows` | Request open promises or active vows. |
| `!record` / `!exchange` / `!rank` | Request the streamer's record, time rate, or your points. |
| `!forgetme` | Remove your viewer data from current projections; older journal snapshots remain. |

Participation is counted once per viewer per action/window. Timed participation windows include 25 seconds of delay grace. Tab has a six-chat-lines-per-minute budget; quiet mode silences outgoing chat.

## How the pieces fit together

For a spoken goal in live mode:

1. The browser captures microphone speech and OpenAI returns a transcript.
2. Local code checks cue words; the Responses API proposes a structured promise.
3. Code validates the proposal and displays a private catch for cancellation/approval.
4. The public card updates the OBS browser source and becomes part of the Twitch video.
5. Twitch delivers viewers' chat/events to the local engine, which counts participation.
6. A due goal can trigger a local OBS receipt and Tab's collection announcement.
7. The streamer opens settlement; code tallies chat votes and records the outcome.
8. SQLite preserves the record and unpaid promises for a later stream's Debt Day.

Time promises use return/overtime clocks rather than collection votes. Vows use Twitch category evidence. AI proposes catches; it does not decide gameplay outcomes. Automatic Twitch clip creation is not included.

## Configuration

Use **Connections**, or copy `.env.example` to `.env` beside `server.mjs` and fill in your values. Start with `npm start`, `npm run dev`, or the launcher to load the file.

| Variable | Purpose / default |
| --- | --- |
| `PORT` | Local HTTP port; `4317`. Restart after changing. |
| `OPENAI_API_KEY` | Your API key for microphone transcription and live AI extraction. |
| `OPENAI_MODEL` | Extraction model; `gpt-4.1-mini`. |
| `TRANSCRIPTION_MODEL` | Transcription model; `gpt-live-transcribe`. |
| `TWITCH_CLIENT_ID` | The application that issued your user tokens. |
| `TWITCH_BROADCASTER_TOKEN` | Broadcaster user token, without a prefix. |
| `TWITCH_BOT_TOKEN` | Optional bot user token; blank uses the broadcaster token. |
| `OBS_URL` | Local OBS WebSocket URL; the template uses `ws://127.0.0.1:4455`. |
| `OBS_PASSWORD` | Match the OBS server password. |
| `OBS_BRB_SCENE` | Exact break-scene name; `BRB`. |
| `OBS_RECEIPT_SOURCE` | Exact media-source name; `hypepilot Receipt`. |

Saved **Connections** values in `data/connections.json` override matching environment values. Blank form fields keep saved values. To replace all saved connections, stop the server, move that file to a private backup outside the project, and restart.

If you change `PORT`, update browser and OBS URLs and any OAuth redirect you use. The Windows launcher's browser shortcut opens port 4317; open a custom port manually.

## Troubleshooting

| Problem | Check |
| --- | --- |
| Node/npm missing or `node:sqlite` errors | Install Node.js 24+ with npm, reopen the terminal, and check `node --version`. |
| Browser cannot reach the desk | Keep the terminal open, wait for the ready message, and refresh the local URL. |
| `EADDRINUSE` | Another copy uses the port. Use that copy, stop it, or configure a different port. |
| `server.mjs` not found | Extract the full ZIP and run commands from the folder containing `package.json`. |
| No automatic AI catch in SIM mode | SIM uses a local parser. Select LIVE TWITCH with a configured OpenAI key for AI extraction. |
| Microphone/session error | Allow browser mic access; check the input device, API key, billing, and model access. Use Chrome/Edge rather than the OBS dock for capture. |
| Twitch redirect mismatch | Match the registered redirect exactly, including the port and trailing slash. |
| Twitch token/subscription failure | Check Client ID, account ownership, scopes, and expiry in Connections; replace invalid tokens and save again. |
| My messages do not fill a goal | Broadcaster and bot messages do not count. Use other viewers or SIM controls. |
| OBS or receipt disconnected | Check local WebSocket URL/password, replay-buffer settings, writable output folder, and exact media-source name. |
| No public card | Review the private catch and approval settings. Only published catches appear on `/overlay`. |
| Vote finishes after the countdown | Wait for the additional 25-second delay grace. |
| Debt Day is still waiting | Send `!first 1` (or another displayed item) and wait through its window/grace; advance time in SIM if needed. |

## Data, sharing, and current limitations

The app creates `data/sim.sqlite` and `data/live.sqlite` for its separate ledgers, and `data/connections.json` for saved credentials. Keep this folder and `.env` private. Share the clean ZIP or source without either. The listener is local-only; do not expose the control desk through port forwarding or a public tunnel.

Audio is sent to OpenAI while listening is enabled. The server keeps recent transcript context in memory; caught quotes are saved. Viewer chat is not sent directly to a model. `!forgetme` removes current viewer projections but does not erase historical snapshots. OBS replay-file cleanup is manual.

The rehearsal and automated tests are verified; real Twitch/OpenAI/OBS use needs an account-connected rehearsal. Automatic Twitch login/token refresh, public Twitch clips, stream markers, and named-category search are not included. Vows require matching category names. The adapter does not subscribe to subscription/Bits events. Safety filters are best-effort, so review catches and use approval mode where needed.

## Project structure

```text
hypepilot/
  README.md
  Start hypepilot.cmd
  package.json
  .env.example
  .gitignore
  server.mjs          Local server, API, detection, and storage
  engine.mjs          Promise rules, timers, and state transitions
  integrations.mjs    Twitch and OBS adapters
  public/             Desk, overlay, styles, audio handling, demo scene
  test/               Automated tests
```

## References

- [Twitch application registration](https://dev.twitch.tv/docs/authentication/register-app/)
- [Twitch OAuth flows](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/)
- [Twitch token validation](https://dev.twitch.tv/docs/authentication/validate-tokens/)
- [OpenAI Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)
- [OBS WebSocket protocol](https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md)
# HypePilot
