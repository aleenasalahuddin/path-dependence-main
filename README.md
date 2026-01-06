# PathNotTaken
<img width="1908" height="838" alt="Screenshot Capture - 2026-01-06 - 23-10-21" src="https://github.com/user-attachments/assets/7ed19032-2b21-4dbf-8478-02c5b8ba8960" />

**PathNotTaken** is a counterfactual simulation web application that explores plausible alternative timelines for past decisions.

Instead of evaluating whether a decision was right or wrong, the system models what *could have plausibly happened* if different paths had been taken, surfacing hidden tradeoffs, opportunity costs, and irreversibility signals.

The tool is designed for strategic reflection, post-mortems, and executive-style retrospectives.

---

## Core Features

- Counterfactual generation for paths not taken
- Plausible alternate timeline narratives
- Hidden opportunity cost analysis
- Tradeoffs avoided by the chosen path
- Irreversibility and path-dependence signals
- Neutral, non-judgmental analysis

---

## How It Works

Users provide:
- Decision context
- The path that was chosen
- Alternative paths that were considered
- A future time horizon

The system generates structured counterfactual outputs that model how each alternative path might have unfolded over time.

---

## Tech Stack

- FastAPI (Python backend)
- LLM-powered simulation engine
- Stateless API design
- JSON-based outputs

---

## Running Locally

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
