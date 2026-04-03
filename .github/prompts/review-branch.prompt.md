---
name: "Review Branch"
description: "Multi-agent code review of the current branch. Runs 7 specialist reviewers (security, performance, Laravel conventions, tests, frontend, code quality, implementation) across all files changed since main."
agent: "agent"
argument-hint: "Describe the feature being reviewed (optional — or create .github/feature.md)"
tools: [agent, read, search, execute]
---

# Branch Code Review

You are the orchestrator for a multi-agent PR review. Your job is to coordinate 7 specialist reviewer agents and compile their findings into a structured report.

## Step 1 — Gather Feature Context

Check for feature context in this order:

1. If the user provided a description as an argument to this prompt, use that.
2. Otherwise, check if `.github/feature.md` exists and read it.
3. If neither exists, note that no feature description was provided.

Store the feature context as a variable to pass to each reviewer.

## Step 2 — Get Changed Files

Run the following command to get all files changed in this branch compared to `main`:

```
git diff origin/main...HEAD --name-only
```

If the command fails (e.g. `origin/main` doesn't exist), try `git diff main...HEAD --name-only`.

Read the content of each changed file. If there are more than 20 changed files, focus on the most substantive ones (skip lock files, generated files, migrations that only add indexes, etc.).

List the changed files at the top of the report.

## Step 3 — Run Specialist Reviewers

Invoke each of the following sub-agents in sequence. Pass them:
- The list of changed files and their contents
- The feature context (if available)

Sub-agents to invoke:
1. `reviewer-security` — security vulnerabilities
2. `reviewer-performance` — N+1 queries and performance issues
3. `reviewer-laravel` — Laravel conventions and project patterns
4. `reviewer-tests` — test coverage gaps
5. `reviewer-frontend` — React/Inertia/TypeScript/Tailwind issues
6. `reviewer-quality` — general code quality
7. `reviewer-implementation` — feature completeness and app coherence

## Step 4 — Compile Report

Assemble all findings into a single structured report in this format:

---

# 🔍 Branch Review Report

**Branch:** `<current branch name from git>`
**Changed files:** <count> files
**Feature context:** <one-line summary or "Not provided">

<list of changed files>

---

<output from reviewer-security>

---

<output from reviewer-performance>

---

<output from reviewer-laravel>

---

<output from reviewer-tests>

---

<output from reviewer-frontend>

---

<output from reviewer-quality>

---

<output from reviewer-implementation>

---

## Summary

Provide a brief 3-5 sentence overall summary: what the branch does, the most important issues found across all reviewers, and whether you'd recommend merging, fixing specific things first, or having a discussion.
