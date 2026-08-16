# Elsewhere Master Record

Last updated: 16 August 2026

This is the single source of truth for Elsewhere. It brings together the product history, current structure, design principles, implemented features, deliberately deferred ideas and the visual language agreed across the different Elsewhere conversations.

When a future Elsewhere conversation starts, this document should be treated as the project brief before adding, removing or redesigning anything.

## 1. What Elsewhere is

Elsewhere is a private, gentle, phone-friendly companion for food, health, style and the parts of life Clare wants to make room for—without turning them into another job.

Its original purpose was not productivity. It was to create small ways back into one's own life when motivation disappears, evenings get lost to scrolling, or doing something enjoyable feels harder to begin than it should.

The enduring tagline is:

> A little way back to yourself.

Elsewhere was created as something personal, not initially as a business or a public wellbeing product.

## 2. Why Elsewhere exists

The original need was to help Clare:

- stop losing evenings to scrolling
- choose something manageable when motivation disappears
- balance a five-day working week with a happier home life
- regain confidence in cooking, walking Hugo and making things
- return to sewing and other creative interests
- build evidence that imperfect attempts are safe
- support a healthier lifestyle without punishment
- make room for interests and identity outside work

The central product idea remains:

> Elsewhere should help someone re-enter their own life, not optimise it.

## 3. Product principles

These are permanent principles unless deliberately revisited:

- **Private and local-first.** Personal records live on the device rather than in the public GitHub repository.
- **Phone-friendly and installable.** The app should feel useful as a small everyday companion, not a desktop dashboard.
- **No streaks, scores, badges or guilt.** Elsewhere must never create a new system to fail at.
- **No demand to be productive.** Rest, reduced capacity and changing one's mind remain valid outcomes.
- **One manageable next step beats a long list.** Where the user is stuck, Elsewhere should reduce decisions rather than create more of them.
- **Not completing something is information, not failure.** The app should respond accordingly.
- **No paid AI dependency inside the app.** ChatGPT handoffs can provide intelligence without making Elsewhere costly or unpredictable to run.
- **No account or cloud dependency by default.** Privacy and simplicity matter more than multi-device convenience.
- **No pressure to monetise hobbies.** Making, sewing, exploring and other interests are allowed to exist simply because they are enjoyable.
- **Workdays and days off can need different things.** Context matters.
- **Low-energy choices count.** Elsewhere should meet the user where they are.
- **Real use drives development.** New features should solve something that has actually become useful or difficult, not be added simply because they are possible.

## 4. Product evolution

Elsewhere has changed substantially since the first prototype, but the changes form a coherent progression.

### Stage 1 — Get me off my phone

The first idea was a tiny decision-reduction tool: when Clare wanted to do something but could not decide what, Elsewhere would offer one manageable suggestion.

### Stage 2 — Make room for parts of life

The app expanded into Hugo, cooking, sewing, making, exploring and private memories. The purpose became less about completing an activity and more about returning to things that felt personally meaningful.

### Stage 3 — A private life companion

Health, medication, food tracking, recipes and backup were added because they became genuine everyday reasons to open the app.

### Stage 4 — Reorganise around real use

The original questionnaire stopped being the front door. Food, Health, Hugo and Sewing became more prominent, with the original chooser retained as an optional tool.

### Stage 5 — Style and Fashion

Fashion was added as a fifth main area on 16 August 2026, turning Elsewhere into a home not just for what Clare does, but also for the personal style she is intentionally building.

The illustrated Fashion boards also established a visual language that should now guide representational imagery across Elsewhere.

## 5. Current information architecture

The main Elsewhere experience now centres on five areas:

1. **Home** — a short launch point for the areas most likely to be useful today.
2. **Food** — food logging, calorie awareness, saved meals, recipes and ChatGPT import.
3. **Health** — private health, medication, symptom, cycle and treatment tools.
4. **Fashion** — capsule wardrobe, illustrated Outfit boards and shopping guidance.
5. **My Life** — Hugo & Me, My Sewing, Make, My Places, saved ideas and the original activity chooser.

The original activity-suggestion experience remains available through **Help me choose something**. It is intentionally no longer a compulsory front-page questionnaire.

Historic **Look at me now** data is retained in local storage and backups even though that section is no longer prominent in navigation.

## 6. Original activity chooser — implemented

The original Today experience asks for:

1. Workday or day off
2. Current energy
3. What would help
4. Which personal area sounds right
5. How much time is available

Energy choices range from **Running on empty** to **Feeling good**.

Activity categories are:

- Make
- Cook
- Hugo
- Explore
- Sew
- Rest
- Choose for me

Elsewhere filters its activity library by context, energy and time, then offers one manageable suggestion. If there is no exact match, it uses a sensible fallback rather than leaving the user stuck.

Supporting routes include:

- **Shape my evening** — a gentle sequence rather than a timetable.
- **Get me off my phone** — an immediate suggestion with no decisions required.
- **I don't feel like doing anything** — validates rest and reduced capacity.
- **Give me another** — offers an alternative without treating the first suggestion as a failure.

## 7. Lock-screen activity support — implemented

An activity can be placed on the phone's lock screen so Elsewhere can be closed while it is done.

Where the installed browser supports notification actions, the experience can offer:

- **I did it**
- **I haven't done it**

The app restores the active activity when reopened and routes notification actions back into the appropriate reflection.

If something is not completed:

- there is no penalty
- a smaller activity can be requested
- it can simply be left for another day

Notification behaviour depends on browser, installation status, operating system and phone privacy settings.

## 8. Completion, preferences and memories — implemented

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

**Look at me now** was created as a private record rather than a performance dashboard. It can contain:

- recent memories
- gentle monthly counts
- Hugo moments and dinners cooked
- personal observations
- proof-of-safety moments
- freeform **Add something I did** entries

Freeform categories include Cooked, Made, Hugo, Explored, Sewed and Rest.

Photos are compressed and stored locally. If device storage is limited, Elsewhere can preserve the memory without the photograph.

## 9. My Life — implemented

### Hugo & Me

Designed to support confidence in taking Hugo out independently through:

- tiny walks
- familiar outings
- feeling-brave options
- a personal list of places
- small pieces of confidence evidence
- the principle that turning around still counts

### My Sewing

Designed to make returning to sewing easier through:

- equipment needed
- things Clare would love to make
- active sewing projects
- small checkable project steps
- permission to begin imperfectly and learn

### Make

A place for creativity that does not need to have a purpose. It includes:

- creative ideas
- saved things to make
- things already made
- deliberately ridiculous prompts
- no pressure to publish, perform or monetise

### My Places

A private atlas containing:

- places visited
- places to try
- optional private photographs
- **Choose somewhere for me**

Completed My Life items can be offered for saving into the private memory record.

## 10. Food — implemented

Food began as **Our Food**, focused on realistic natural-ingredient meals and building confidence around cooking rather than measuring performance.

Its language was intentionally supportive: learning **one dinner** rather than being told to **learn how to cook**.

The later Food experience expanded to support calorie awareness while retaining the same non-punitive philosophy.

Current functionality includes:

- breakfast, lunch, dinner, snacks and drinks recorded separately
- daily calorie totals
- an optional calorie target
- quick food entry with a calorie estimate
- saved and reusable meals
- recent food history
- editing and removing recorded food
- preserving earlier food data as features evolve

### Recipe calculator

A recipe can be built from ingredients by entering:

- recipe name
- number of portions
- ingredients
- calorie values

Elsewhere calculates the whole-recipe total and calories per portion. A saved portion can then be added to the day's food record.

### Paste from ChatGPT

A paste importer allows calculations completed in ChatGPT to be brought into Elsewhere without putting paid AI inside the app.

It can support information such as:

- recipe name
- total calories
- calories per portion
- number of portions
- formatted meal and calorie estimates

## 11. Health — implemented

Health was added while keeping the local-first privacy model.

Current capabilities include:

- cycle records
- symptom records
- private weight records
- weight-treatment tracking
- medication details
- medication start dates
- daily pill reminders
- health-concern dates
- notification testing
- push-delivery diagnostics
- recording when a push reaches the device

Personal health information is not uploaded to the public GitHub repository.

## 12. Fashion — implemented

Fashion became a fifth main area on 16 August 2026.

It is based around a British-countryside/Dorset capsule rather than trend-led shopping. The palette is built around cream, oatmeal, khaki, olive, navy, muted blues, dark indigo and warm brown leather.

The capsule contains **34 pieces** across:

- Outerwear
- Knitwear
- Shirts & tops
- Bottoms
- Dresses
- Shoes
- Accessories

Items can be marked as owned and are prioritised using:

- **Own**
- **Start**
- **Invest**
- **Later**

Progress is saved locally on the device.

### Outfit boards

Ten repeatable outfit formulas are built into Fashion:

1. Farm, but polished
2. Village errands
3. Cold ordinary day
4. Lunch or work
5. Quietly smart
6. Soft colour
7. Spring Dorset
8. A bit feminine
9. Easy weekend
10. Actually dressed

As of 16 August 2026, all ten Outfit cards use the new editorial illustrated boards rather than the earlier simplified generated wardrobe diagrams.

### Shop

The Shop section connects capsule needs to suggested products and distinguishes where saving or investing makes sense.

Shopping tiers include:

- SAVE
- MID
- INVEST
- SALE FIND

The principle is to build the wardrobe gradually rather than treating the capsule as a 34-item shopping order.

## 13. Elsewhere visual language — default from 16 August 2026

The illustrated Outfit boards establish the default **representational visual language** for Elsewhere going forward.

Internally this can be referred to as **Elsewhere Editorial Illustration**.

### Core character

The style should feel:

- warm
- grown-up
- quietly elegant
- editorial rather than cartoonish
- tactile and hand-rendered
- rooted in ordinary real life rather than aspiration theatre

### Illustration treatment

Default representational illustrations should use:

- soft painterly gouache/watercolour-style rendering
- restrained pencil or ink-like detail where useful
- natural proportions and believable posture
- warm ivory, parchment or softly textured backgrounds
- subtle depth rather than glossy 3D rendering
- enough detail to make clothing, food, objects, plants, landscapes and animals feel specific
- a calm composition with breathing room

They should **not** default to:

- childish cartoons
- generic wellness clipart
- shiny AI-looking 3D scenes
- neon or highly saturated palettes
- fashion-sketch clichés with exaggerated bodies
- glossy luxury imagery that makes ordinary life look like a campaign advert

### Colour language

Illustrations should harmonise with the established Elsewhere interface:

- forest and olive greens
- cream and oatmeal
- navy and muted blue
- cognac and chocolate brown
- sage
- soft clay
- warm paper neutrals

Colour can vary where the subject requires it, but it should remain softened and natural rather than loud.

### World and texture

Where relevant, favour recognisable tactile materials and details such as:

- waxed cotton
- tweed
- wool and knitwear
- denim
- leather
- pottery and kitchen textures
- plants and garden details
- country lanes, fields and hedgerows
- dogs and outdoor life
- lived-in domestic details

The world should feel British, rural and real when the subject calls for it—not like costume country, a stately-home fantasy or a generic American farmhouse aesthetic.

### Continuity

When a recurring person, animal, object or place has already been established visually, future illustrations should preserve that continuity rather than reinventing the subject every time.

### Where illustration belongs

This is the default for **representational imagery**, not a requirement to illustrate every interface element.

Functional UI should remain clean and accessible. Simple icons, charts, photographs and diagrams are still appropriate where they communicate information better.

The rule is:

> If Elsewhere needs a scene, character, outfit, lifestyle moment or other expressive image, start with Elsewhere Editorial Illustration unless there is a clear reason not to.

## 14. Backup and restore — implemented

Elsewhere can export and restore its locally stored information.

Backup coverage is designed to include:

- food records
- recipes
- health information
- Hugo progress
- sewing progress
- saved places
- historic memories
- locally stored photographs where supported

This matters because there is no account or cloud profile. Clearing browser data, deleting the installed app or changing devices can remove local information unless a backup has been exported.

## 15. Privacy model

Elsewhere is local-first.

The GitHub repository contains the application code and shared app assets—including the editorial Outfit illustrations—but not the user's private records.

The current model intentionally avoids:

- a user account
- a public profile
- a required cloud database
- paid AI calls for ordinary app use

Any future change to that model should be treated as a major product decision, not a small technical convenience.

## 16. Deliberately deferred or out of scope

### Food-photo calorie estimation

The idea was to photograph a home-cooked plate, estimate the food and calories, and potentially remember what a saved recipe looks like.

It was deliberately deferred because it would introduce:

- AI or external image-analysis costs
- uncertain portion and calorie accuracy
- additional privacy decisions
- extra technical dependency

The current recipe and ChatGPT-paste approach meets the immediate need without those costs.

### Accounts and cloud synchronisation

Not currently planned. They would change the privacy model, increase maintenance and potentially add cost.

### Commercialisation

Elsewhere is currently a personal tool. It should not be forced into becoming a sellable product simply because a commercial version is technically possible.

### Gamification

Streaks, scores, badges, leaderboards and punitive progress mechanics conflict with the core product principles.

## 17. Current state

The GitHub Pages version now combines:

- practical Home
- original gentle activity chooser
- lock-screen activity support
- completion reflections and private memories
- local photographs
- Hugo confidence support
- sewing projects and checkable steps
- Make and My Places
- private health and medication tools
- meal-by-meal food and calorie tracking
- saved meals and food history
- recipe calculations
- ChatGPT paste import
- full backup and restore
- 34-piece Fashion capsule
- ten illustrated Outfit boards
- capsule shopping guidance
- the Elsewhere Editorial Illustration visual standard

Becoming and Elsewhere remain separate projects. There is no requirement to merge Becoming features into Elsewhere.

## 18. Development timeline

### Early August 2026

- original anti-scroll / **give me one thing** concept
- workday/day-off, energy, need, area and time filtering
- Shape my evening
- Get me off my phone
- I don't feel like doing anything
- lock-screen activity concept
- completion reflections and proof-of-safety option
- activity preferences
- Look at me now and private memories
- My Things: food, Hugo, sewing, making and places

### 7 August 2026

- Elsewhere GitHub repository created
- installable web app added
- service worker, manifest and app icon added
- freeform activity logging added
- V4 activity experience built

### 8 August 2026

- private photo support added for memories and places

### 10–11 August 2026

- private Health tools added
- medication and weight-treatment tracking added
- medication dates and health-concern dates added
- reminder and push-delivery diagnostics improved
- My Things completion checkboxes added
- completed My Things can be offered for saving to memories

### 13 August 2026

- sewing projects gained small checkable steps
- achievement handling updated to preserve the project-step behaviour

### 15 August 2026

- simple meal-by-meal calorie tracking added
- saved meals and food history added
- recipe calculator added
- ChatGPT recipe/food paste importer added
- backup coverage expanded
- Phase 4 simplification reorganised the app around real use

### 16 August 2026

- Fashion added as a fifth main area
- 34-piece British-countryside capsule added
- Capsule, Outfits and Shop sections added
- capsule shopping list completed
- ten editorial Outfit illustrations added to the live repository
- Outfit section updated to use those illustrations
- Elsewhere Editorial Illustration established as the default representational visual language

## 19. Decision filter for future changes

Before adding a new feature, ask:

1. Does this help the user return to or look after their own life?
2. Does it reduce decisions or pressure rather than create another obligation?
3. Can it remain private, simple and inexpensive to operate?
4. Has real use shown a need for it?
5. Does it belong in one of the existing areas before a new area is created?
6. If it needs imagery, does it follow Elsewhere Editorial Illustration unless another format is genuinely more useful?
7. Will it preserve existing local data and backup compatibility?

If the answer to those questions is mostly no, Elsewhere probably does not need the feature.

## 20. Next development approach

Elsewhere is now broad enough that the default should be **refine before expanding**.

Future work should be based on ordinary use: what gets opened, what is ignored, where friction occurs, which reminders are useful, what creates pressure, and which sections genuinely make life easier or more enjoyable.

The goal is not to make Elsewhere bigger.

The goal is to make it increasingly feel like a useful, beautiful little place to go when the user wants to look after their own life.
