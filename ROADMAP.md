# Elsewhere: combined project roadmap

Last updated: 15 August 2026

This document brings together the work completed across the different Elsewhere conversations. It separates implemented features from ideas that were deliberately deferred.

## 1. Why Elsewhere exists

Elsewhere was created as something personal—not initially as a business or a public wellbeing product.

The underlying need was to help Clare:

- stop losing evenings to scrolling
- choose something manageable when motivation disappears
- balance a five-day working week with a happier home life
- regain confidence in cooking, walking Hugo and making things
- return to sewing and other creative interests
- build evidence that imperfect attempts are safe
- support a healthier lifestyle without punishment

The central idea is not productivity. It is creating small ways back into one's own life.

## 2. Product principles

The agreed principles are:

- private and local-first
- phone-friendly and installable
- one suggestion at a time
- no account or cloud dependency
- no streaks, scores, badges or guilt
- no paid AI inside the app
- no pressure to turn hobbies into income
- workdays and days off treated differently
- low-energy choices remain valid
- not completing something is information, not failure

## 3. Original activity flow — completed

The Today experience asks for:

1. Workday or day off
2. Current energy
3. What would help
4. Which personal area sounds right
5. How much time is available

Energy choices range from “Running on empty” to “Feeling good”.

Activity categories are:

- Make
- Cook
- Hugo
- Explore
- Sew
- Rest
- Choose for me

Elsewhere filters its activity library by context, energy and time, then offers one manageable suggestion. If there is no exact match, it uses a sensible fallback rather than leaving the user stuck.

Also completed:

- “Shape my evening” creates a gentle plan rather than a timetable
- “Get me off my phone” provides an immediate prompt with no decisions
- “I don't feel like doing anything” validates rest and reduced capacity
- alternative suggestions remain available without treating the first choice as a failure

## 4. Lock-screen activity support — completed

An activity can be placed on the phone's lock screen so the app can be closed while it is done.

Where the installed browser supports it, the notification offers:

- I did it
- I haven't done it

The app restores the active activity when reopened and routes notification actions back into the appropriate reflection.

If an activity is not completed:

- there is no penalty
- the user can request something smaller
- the activity can simply be left for another day

Notification availability depends on the phone, browser, installation status and permission settings.

## 5. Completion, preferences and memories — completed

After doing something, the user can optionally record:

- what happened
- how it felt
- whether they would do it again
- a photograph
- whether it felt like proof they were safe

Activity preferences include:

- Loved this
- Save for later
- Not for me

“Look at me now” provides a private record rather than a performance dashboard. It includes:

- recent memories
- gentle monthly counts
- Hugo moments and dinners cooked
- personal observations
- proof-of-safety moments
- freeform “Add something I did” entries

Freeform categories include Cooked, Made, Hugo, Explored, Sewed and Rest.

Photos are compressed and stored locally. If device storage is limited, Elsewhere can preserve the memory without the photograph.

## 6. My Things — completed

“My Things” collects areas of life Clare wants to return to.

### Our Food

Originally built around realistic, natural-ingredient meals:

- food Clare can imagine cooking
- meals already known
- ideas to try
- supportive wording such as learning one dinner rather than “learning how to cook”
- no diet punishment

### Hugo & Me

Supports confidence in taking Hugo out alone:

- tiny walks
- familiar outings
- feeling-brave options
- a personal list of places
- small pieces of confidence evidence
- turning around still counts

### My Sewing

Supports returning to sewing through:

- equipment needed
- things Clare would love to make
- active sewing projects
- small checkable project steps
- permission to start badly and learn

### Make

Includes:

- creative ideas without a required purpose
- saved creative things
- things already made
- deliberately ridiculous prompts
- no pressure to publish or monetise

### My Places

A private atlas containing:

- places visited
- places to try
- optional private photographs
- “Choose somewhere for me”

Items completed within My Things can be offered for saving into Look at me now.

## 7. Private health support — completed

Health tools were later added while retaining the local-first model.

Completed capabilities include:

- private weight records
- weight-treatment tracking
- medication details
- daily pill reminders
- medication start dates
- health-concern dates
- notification testing
- push-delivery diagnostics
- recording when a push reaches the device

Health information is not uploaded to GitHub.

## 8. Food and calorie tracking — completed

The Eat experience was expanded to support weight-loss awareness without changing Elsewhere into a punitive diet app.

Completed functionality:

- record breakfast, lunch, dinner and snacks separately
- show a daily calorie total
- set an optional calorie target
- add a food with a calorie estimate
- save meals for reuse
- view recent food history
- edit or remove recorded food
- preserve existing food data as the feature evolved

The interface and cached assets were refreshed so installed copies receive the latest version.

## 9. Recipe tools — completed

### Build from ingredients

The recipe calculator allows the user to:

- enter a recipe name
- choose the number of portions
- add ingredients and calorie values
- calculate the whole-recipe total
- calculate calories per portion
- save the recipe
- add one portion to the day's meal record

### Paste from ChatGPT

A pasted-recipe importer was added for information calculated in another ChatGPT conversation.

It supports bringing across:

- recipe names
- total calories
- calories per portion
- portion counts
- meal information formatted for Elsewhere

This keeps the app itself free from AI charges while still allowing ChatGPT to help calculate recipes.

### Recent refinements

The latest Eat work added:

- better daily tracking
- improved ChatGPT food import
- food history
- backup coverage for food information
- more reliable rendering of the enhanced Eat screen
- cache updates so the installed phone copy refreshes correctly

## 10. Backup and restore — completed

A full Elsewhere backup and restore facility now protects locally stored information.

The backup is designed to include the app's saved data, with local photographs handled through the app's device storage where supported.

This is important because:

- there is no account
- the repository does not contain personal records
- deleting browser data or changing phones can remove local information
- an exported backup provides the route to recovery

## 11. Deliberately deferred

The following ideas were discussed but are not part of the current build:

### Food-photo calorie estimation

The idea was to photograph a home-cooked plate, estimate the food and calories, and potentially remember the finished appearance of a saved recipe.

This was deliberately deferred because it would require:

- AI or an external image-analysis service
- ongoing usage costs
- uncertain portion and calorie accuracy
- additional privacy decisions

The current recipe and paste tools meet the immediate need without those costs.

### Accounts and cloud synchronisation

Not currently planned. They would change the privacy model, introduce maintenance and potentially add cost.

### Commercialisation

Elsewhere is currently a personal tool. It should not be forced into becoming a sellable product unless Clare later decides that is genuinely helpful.

## 12. Current state

The current GitHub Pages version combines all implemented work from the separate conversations:

- core activity suggestions
- lock-screen support
- memories and photographs
- My Things
- Hugo confidence support
- sewing project steps
- private health and medication tools
- meal-by-meal calorie tracking
- recipe calculations
- ChatGPT paste import
- food history
- full data backup and restore

There is no known later Becoming feature that needs merging into Elsewhere. Becoming and Elsewhere remain separate projects.

## 13. Next sensible step

Do not add another major feature immediately.

The next useful step is to use the complete app for several ordinary workdays and days off, then note:

- what Clare naturally opens
- what remains confusing
- what never gets used
- whether the Eat screen feels easy enough during a real day
- whether reminders are reliable
- whether the app helps reduce scrolling
- whether any part creates pressure rather than relief

Future changes should be based on those real-use observations rather than adding ideas simply because they are possible.
