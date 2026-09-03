# Mailing List & Subscriber Strategy

How the email list works — the tools, the data model, and the rules for
keeping it clean over time. Provider: **Kit (ConvertKit)**, free plan.

## Goal

Build a durable, owned audience we can email when there's a show worth coming
to — and keep two groups cleanly separated:

- **Opt-in subscribers** — people who signed up via a form (full consent to
  ongoing announcements). This is the real list.
- **Ticket buyers** — imported from a venue's purchaser list (consented to info
  about *that* show, not the ongoing newsletter).

## Setup

- **One Kit form** (`9759877`) backs every signup on the site, submitted via the
  shared `event.js` (background submit, no page reload).
- **Sending domain:** emails send from `nishil@nishilshah.live` (a verified
  custom from-address). Sending from a Gmail address landed in spam — the custom
  domain address fixed it. `nishil@` is a Porkbun forward; no paid mailbox needed.
- **Double opt-in** is on: form signups get a confirmation email (customized in
  Kit → form → Settings → Incentive to double as the welcome). Imports do NOT
  get a confirmation email — they're added as `confirmed` directly.

## Where signups come from

Each form stamps a hidden `source` value (needs the `source` custom field in Kit):

- `/subscribe` → `source: subscribe` (link-in-bio, QR codes, texts)
- `/on-oct-25` (and future show pages) → `source: <slug>`
- `show-template` → set to the show's slug when copied

## Data model — two mechanisms, two jobs

### Tags = membership (additive, permanent)
- **`mailing-list`** — opted in; wants ongoing announcements. **The core audience.**
- **`buyer`** — has ever bought a ticket (umbrella; apply to every buyer).
- **`buyer:<show>`** — bought a ticket to a specific show (e.g. `buyer:oct25`).

Apply **both** `buyer` and `buyer:<show>` on every buyer import — gives you
"all buyers ever" (one tag) *and* per-show targeting.

### `source` custom field = attribution (last-touch, not used to gate sends)
Just color for "where did they come from." Can be overwritten on re-import —
doesn't matter, sending logic never depends on it.

**Why tags, not a "Subscriber Type" field:** a field holds one value, so it
can't represent someone who is BOTH a subscriber AND a buyer (superfans). Tags
are additive — a person can hold `mailing-list` + `buyer:oct25` at once.

## Send rules

- **Ongoing "come to my show" blasts → send TO `mailing-list`.** Always positive
  inclusion. Never market by *excluding* buyer tags, or you'd drop superfans who
  bought *and* subscribed.
- **Event reminders for show X → send TO `buyer:<show>`** (Kit Broadcasts can be
  scheduled, e.g. 7 days out).
- **Blast everyone who's ever bought → send TO `buyer`.**

## The workflow ritual (free plan)

Auto-tagging form signups is paywalled, so tag opt-ins in batches:

1. **Before an import or an ongoing blast:** in Subscribers, filter to confirmed
   people with no `mailing-list` and no `buyer` tag (= new form opt-ins), select
   all, add `mailing-list`. ~2 min.
2. **Import buyers:** apply `buyer` + `buyer:<show>` tags (and `source` via a CSV
   column). Do NOT add `mailing-list` (they didn't opt in).

## Import behavior / edge cases

- **Kit dedupes by email** — importing a buyer who's already a subscriber merges
  into the existing record (no duplicate).
- **Tags are additive** — the buyer tags get added; existing `mailing-list` and
  confirmed status are preserved. So superfans land correctly in both segments
  even without the pre-sweep.
- **Custom fields overwrite** — a `source` column overwrites the existing value.
  Fine (it's just attribution); omit the column if you don't want to touch it.
- **Buyer converts to subscriber** — if a buyer later opts in via a form, the
  next sweep tags them `mailing-list`; they keep their `buyer` tags. Self-heals.
- Imported buyers count toward the free **1,000-subscriber** limit.

## Free-plan limits & the one upgrade that helps

Everything above works on free. The only friction is the manual sweep in step 1
(because auto-rules are paid). The Creator plan's automation — "subscribes to
form → add `mailing-list`" — removes that sweep entirely. Not needed at current
size; revisit if the list grows and the sweep gets tedious.
