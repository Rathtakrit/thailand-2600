# Brief: About page, contact footer and a room intro

Asked for by the owner on 2026-11-17. Earlier choices are in the other briefs and are not repeated here.

## Idea
An About page that says what Thailand 2600 is, our goals and what is stopping us, with a way to contact the two
contributors. Then a new home-page intro that hooks the visitor: a room of today with a TV showing a lively
Thailand in 2600.

## Decisions (2026-11-17)
| Topic | Decision | Why |
|---|---|---|
| Room style | Drawn and animated, in the site's own colours | The reference site is a photo-real 3D render we cannot make; a drawing is light on phones and fits day and night mode |
| Screen | A TV in a Thai living room of today | Owner's choice |
| Contact | GitHub profile links for Pincassociation and Rathtakrit, plus one shared project email once it exists | The repo is public; no personal email addresses in it |
| About text | Claude drafts in English and Thai, the owner approves | |
| "What's stopping us" | About the real world, not the project: what in Thailand and the world makes it hard to believe life can get better | Owner's words, 2026-11-17 |
| Contact roles | Pincassociation created the site (idea, design, build); Rathtakrit looks after the in-house rules | Owner's words, 2026-11-17 |
| About page look | Its own pink and mint colours, day and night, with a drawn Thai pavilion, lotus flowers, arch-shaped goal cards, and butterflies and glitter that follow the pointer. The rest of the site keeps the colour charts | Owner's reference pictures, 2026-11-17 |
| Contact footer | Stays on the About page only. Drawn as the back of an envelope with a flap and a seal. Pincassociation's button has a baby-blue cake, Rathtakrit's a green kiwi | Owner's words |
| Feedback button | Shown now with a "coming soon" note; where it leads is decided later (project email, GitHub, or a form on the site) | No project email yet |
| Home intro | The room is the opening screen of the home page. The TV is the way in: a tap zooms into the screen and moves down to the headline, map and problems. The wall calendar shows this year, the TV shows 2600 | Owner's words, 2026-11-17 |
| Footer on every page | Dropped: the contact footer stays on the About page only | Owner's words, 2026-11-17 |

Small technical picks (Claude's): the About text lives in `lib/about.ts`; no new packages; motion stops for
visitors who ask for reduced motion.

## Open questions
| Question | Who answers | Blocks |
|---|---|---|
| Is the draft About text right, above all "What's stopping us" and each person's one-line role? | Owner | Committing step 1 |
| Is Rathtakrit happy to be named on a public page? | Rathtakrit | Opening to the public |
| What is the shared project email? | Owner | The email button in the footer |
| The phone header now takes four rows with three tabs. Move About to the footer only? | Owner | Nothing |

## Steps
| # | Step | How to check |
|---|---|---|
| 1 | About page with a tab | Owner reads the draft in the preview, phone and desktop size |
| 2 | Footer with contact on every page | Preview at phone and desktop size |
| 3 | Home-page intro: drawn room with a TV showing Thailand 2600 | Preview, day and night; owner sees a first drawing before the motion is finished |
