# Fitlane CLI

> **One command. Human-readable results.** Search IT candidates and jobs from your terminal — powered by [**Fitlane AI**](https://fitlaneai.com).

```
$ fitlane candidates "senior react remote eu" --limit 3

julian-becker  Senior Frontend Engineer  (senior, 6y)
  stack    typescript, next.js, react, tailwind
  location Berlin, DE · remote-ok
  salary   7800 EUR/month
  signal   Led design system rollout across 6 internal products
```

**That is the whole interaction.** One command, ranked candidates, plain-text output you can read at a glance — no JSON to parse, no filter chips to click, no dashboard to open. Pipe it to `grep`, paste it into Slack, screenshot it for the hiring manager.

`fitlane` is an open-source command-line client for the Fitlane AI hiring platform. It is designed for recruiters who live in the terminal (or want to): you can find candidates, browse open jobs, and get a recruiter-grade explanation of *why* a candidate fits a job — in under 90 seconds, without opening a browser.

The CLI ships with a built-in **mock mode**, so you can try every command before the production API is publicly available. When your API key is ready, run `fitlane configure` and switch to live mode without changing any scripts.

---

## Install

```bash
npm install -g fitlane
```

That is it. The binary is called `fitlane` and works on macOS, Linux, and Windows (Node 18+).

Verify the install:

```bash
fitlane --version
fitlane --help
```

> Prefer not to install globally? `npx fitlane candidates "senior python"` works as well.

---

## Quick start (90 seconds, recruiter edition)

```bash
# 1. Install
npm install -g fitlane

# 2. (Optional) Configure — skip this and you will get sample data immediately
fitlane configure

# 3. Find candidates
fitlane candidates "senior backend python remote"

# 4. Find open jobs that match a candidate
fitlane jobs "backend python b2b saas"

# 5. Explain a match
fitlane match marta-kowalska lumeris-backend
```

That is the whole product surface. Five commands, one minute, real shape of the answer.

---

## Commands

### `fitlane configure`

Set the run mode and (optionally) the API key. Stored at `~/.config/fitlane/config.json` with `0600` permissions.

```bash
fitlane configure          # interactive
fitlane configure --reset  # remove existing config
```

You can also set everything via environment variables (useful for CI and shared workstations):

```bash
export FITLANE_MODE=live
export FITLANE_BASE_URL=https://api.fitlaneai.com/v1
export FITLANE_API_KEY=fl_xxx
```

### `fitlane whoami`

Show the current configuration without revealing the key value.

### `fitlane candidates <query>`

Search the Fitlane candidate database.

```bash
fitlane candidates "senior python fastapi remote"
fitlane candidates "react" --seniority senior --location remote --limit 10
fitlane candidates "go kubernetes" --stack go,kubernetes --json
```

Options:

| Flag | Description |
|---|---|
| `-l, --limit <n>` | how many candidates to return (default 5) |
| `--location <loc>` | filter by city, country, or `remote` |
| `--seniority <level>` | `junior` &#124; `middle` &#124; `senior` &#124; `staff` &#124; `principal` |
| `--stack <skills>` | comma-separated must-have stack |
| `--json` | output raw JSON (for piping into `jq`) |

### `fitlane jobs <query>`

Same shape, but searches open jobs.

```bash
fitlane jobs "senior frontend nextjs remote"
fitlane jobs "ml engineer pytorch" --json | jq '.results[].company'
```

### `fitlane match <candidateId> <jobId>`

The killer command. Given a candidate ID and a job ID, returns:

- a numeric match score (0-100), computed deterministically in code,
- the top 2-3 reasons the candidate fits,
- 1-3 honest gaps visible in the data,
- the single most useful question to ask on the screening call.

```bash
$ fitlane match marta-kowalska lumeris-backend

Match score: 84 / 100

Why this fits
  - Full stack overlap (python, fastapi, postgresql) matches every must-have on the job.
  - Seniority match: candidate is senior, job asks for senior.
  - Remote-friendly on both sides.

Why it might not
  - Salary expectation 8500 EUR/mo is 0% above the band max (8500).

Recruiter next step
  - Confirm start-date availability and notice period.
```

---

## Mock mode (default until you configure)

`fitlane` runs in **mock mode** out of the box. You get curated sample candidates and jobs so you can try every command, write scripts, and demo to colleagues *before* the production API is live.

Valid mock IDs are human-readable slugs:

- Candidates: `marta-kowalska`, `julian-becker`, `tiago-almeida`, `nino-beridze`, `lotte-van-dijk`, `petr-novak`, `stefan-jovanovic`, `kristjan-saar`
- Jobs: `lumeris-backend`, `brigantia-frontend`, `skywell-staff-backend`, `pinepath-fullstack`, `quantcrest-ml`, `korvus-devops`

When your live API key arrives:

```bash
fitlane configure
# choose "live", paste the API key, done
```

All commands work identically — only the data source changes.

---

## Output: human and machine

By default every command prints a colourised, recruiter-friendly view. Pass `--json` to get the raw payload, perfect for `jq`, shell pipelines, or wrapping the CLI inside another tool.

```bash
fitlane candidates "senior python" --json \
  | jq '.results[] | select(.salary.amount < 8000) | .id'
```

---

## Multilingual queries

Every `<query>` argument is free-form text. The Fitlane ranking engine accepts the same recruiter brief in English, Spanish, German, Ukrainian, and Russian — type the role the way you would say it out loud, in your own language.

```bash
fitlane candidates "Senior Backend Go, Series A fintech, Berlin hybrid, high-load >1k RPS"
fitlane candidates "Senior iOS, SwiftUI + TCA, EdTech 5M MAU, remoto desde UE/LATAM"
fitlane candidates "Senior DevOps als erster DevOps-Hire, EKS-Migration, Remote, bis 110.000 €"
fitlane candidates "Senior React-розробник з 5+ роками, Next.js 14, віддалено, до $4 500"
fitlane candidates "Senior PHP-разработчик, Laravel 10–11, DDD/Hexagonal, удалёнка, 300k+"
```

For a curated library of one-prompt searches in all five languages, see the [multilingual search recipe](https://github.com/anatolygridasov/fitlane-cookbook/blob/main/prompts/09-multilingual-search.md) in the companion cookbook.

---

## How it fits with the platform

The CLI is a thin client over the same API that powers [fitlaneai.com](https://fitlaneai.com). The web app gives you the full experience — candidate profiles with privacy-mode toggles, a built-in hiring chat, multi-stakeholder pipelines. The CLI gives you the 80% you can run in 90 seconds, scripted, from your terminal.

If you want to *write* the prompts that power match explanations, browse the companion repo: **[fitlane-cookbook](https://github.com/anatolygridasov/fitlane-cookbook)** — open-source prompts and automation scripts for IT recruiting.

---

## Roadmap

The current 0.x release covers:

- `candidates`, `jobs`, `match`, `configure`, `whoami`
- mock mode with curated sample data
- JSON output for shell pipelines

Likely next:

- `pipeline` command (list candidates in a hiring pipeline by stage)
- `outreach` command (generate a first-touch message from a candidate-job pair)
- shell completion (`fitlane completion zsh`)
- per-command `--export csv|xlsx`

PRs welcome.

---

## Contributing

```bash
git clone https://github.com/anatolygridasov/fitlane-cli.git
cd fitlane-cli
npm install
node bin/fitlane.js --help
```

Open an issue before a large PR, please — most additions only make sense once aligned with the platform roadmap.

---

## License

MIT — see [LICENSE](LICENSE).

Built and maintained by the [Fitlane AI](https://fitlaneai.com) team.
