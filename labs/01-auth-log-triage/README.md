# Lab 01 · Authentication log triage

**Level:** Beginner · **Environment:** Offline · **Data:** Synthetic

## Purpose

Investigate a successful sign-in preceded by repeated authentication failures. Practice grouping events, reading a timeline, separating evidence from inference, and writing a short incident assessment.

**Provenance:** Prepared with AI assistance. The analyzer was executed by the assistant on October 23, 2026; its built-in assertions passed. This is not evidence that the profile owner has completed the exercise or investigated a real incident.

## Files

| File | Purpose |
|---|---|
| [events.json](events.json) | Nine synthetic sign-in events using documentation-only IP addresses |
| [analyze.mjs](analyze.mjs) | Dependency-free Node.js analyzer with assertions |
| [verified-output.json](verified-output.json) | Captured output of the assistant's validation run |
| [WORKSHEET.md](WORKSHEET.md) | Questions and learner reflection to complete |

## Run

Install Node.js, clone this repository and run from its root:

```sh
node labs/01-auth-log-triage/analyze.mjs
```

No network connection or privileged access is used by the analyzer.

## Detection rule

For the same source IP and user, flag a success when five or more failures occurred in the preceding five minutes, including the boundary. This simple rule illustrates a pattern; it is not a production detector or proof of account compromise.

## Observed result

The nine-event fixture produces one alert: `lab-user` at `192.0.2.10` succeeds at 12:04:30 UTC after five failures. The normal success and single-typo sequence are not flagged. Automated assertions confirm the alert count, user and failure count.

## Investigation reasoning

**Evidence:** Five failed sign-ins and then a success from one source for one account.
**Hypothesis:** Password guessing may have succeeded.
**Alternatives:** A legitimate user mistyped a password repeatedly; a shared address may represent multiple devices.
**Additional evidence needed:** Device identity, MFA results, location context, account activity and the user's confirmation.
**Decision:** Escalate for review in a real environment; this fixture alone does not justify declaring compromise.

## Practice

1. Run the baseline and compare it with the saved output.
2. Move the success to 12:10:01 UTC. Predict why the assertion fails.
3. Restore the fixture. Change one failure to another user. Predict the outcome.
4. Restore the fixture and complete the worksheet in your own words.
5. Capture your own terminal output after removing personal filesystem paths.

## Limitations and next improvements

The rule groups by both account and IP, so distributed attempts across IPs may be missed. Shared IPs can produce false positives. It does not deduplicate events or reset the window after a successful login. The assertions are specific to this fixture, not comprehensive coverage. A future exercise can add boundary tests, multiple users, malformed input, deduplication and alert suppression.
