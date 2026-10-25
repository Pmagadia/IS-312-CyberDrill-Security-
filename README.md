# CyberDrill

Hands-on practice for the CompTIA Security+ exam. IS312 Web Design and Programming, Team 1.

Built with React, TypeScript, HTML5 and CSS3. Tested with Jest and React Testing Library.

| Module | Folder | Owner |
| --- | --- | --- |
| Incident Response Simulator | `src/modules/incident-response` | Peterson |
| Port & Protocol Match | `src/modules/port-protocol` | Karen |
| Log Analysis Challenge | `src/modules/log-analysis` | Roland |
| Suspicious Link Analyzer | `src/modules/link-analyzer` | Hector |
| App shell (navigation, layout) | `src/App.tsx`, `src/index.css` | Karen |
| Progress dashboard | `src/pages/Dashboard.tsx` | Roland |
| Shared scoring system | `src/shared/scoring.ts` | Peterson |

## Getting started (nothing to install)

We work in **GitHub Codespaces**, which is VS Code in your browser with everything already set up.

1. On this repo's GitHub page, click the green **Code** button, open the **Codespaces** tab, and click **Create codespace on main**.
2. Wait for it to finish loading. The first time takes a few minutes because it runs `npm install` for you.
3. In the terminal at the bottom, run `npm run dev`. Click **Open in Browser** when it pops up to see the app.
4. Run the tests any time with `npm test`.

Stop your codespace when you're done (**Code > Codespaces > ... > Stop codespace**) so it doesn't use up free hours.

## How we work

1. **Pick an Issue** on the Projects board and assign it to yourself.
2. **Make a branch** named `yourname/short-description`, for example `karen/drag-and-drop`. In Codespaces: click the branch name in the bottom-left corner, then **Create new branch**.
3. **Work only in your own module folder** where possible. This keeps us from overwriting each other's work.
4. **Commit and push** from the Source Control tab (the branch icon on the left side).
5. **Open a pull request** into `main` on GitHub and ask a teammate to review it. Nobody pushes straight to `main`.

## Saving scores

Every module records a finished attempt with the shared scoring system:

```ts
import { saveScore } from '../../shared/scoring'

saveScore('log-analysis', 8, 10) // 8 out of 10 points
```

The dashboard reads these scores automatically. Talk to Peterson before changing anything in `src/shared/scoring.ts`.

## Rules for practice content

- Write every question, scenario, log file and example ourselves, based on the official CompTIA Security+ exam objectives.
- Never use real exam questions or "braindump" sites.
- Use made-up company names and domains in examples (for example `example.com`), not real brands.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the app with live reload |
| `npm test` | Runs all Jest tests |
| `npm run build` | Builds the site for GitHub Pages into `dist/` |
| `npm run lint` | Checks the code for common mistakes |
