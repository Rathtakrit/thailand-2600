# Brief: drawings, 3D models and the gallery

From the `/kickoff` interview on 2026-11-16. Earlier choices (framework, database, sign-in, scoring) are in
`2026-11-first-build.md` and are not repeated here.

## Idea
In the owner's words: "I create the place where people can post their problems whatever see in Thailand, and other
people can post their solution to each problem like they are pitching. The solution then will be evaluate by AI
judge, and can be further adjusted by real human (across 6 criterions I build)."

This step lets a pitch be seen, not only read: people draw it, add a picture, or add a 3D model, and every
visualized pitch appears in one gallery.

- **First users:** the team and 20 to 50 invited people we know.
- **Success:** three months after they arrive, people outside the team have posted (target to set, for example
  50 problems and 100 solutions).

## Decisions (2026-11-16)
| Topic | Decision | Why |
|---|---|---|
| Predictions | Not part of the site | The owner's idea is problems and pitched solutions only |
| Build next | Drawings, pictures, 3D models, gallery tab | Most helps people imagine the future |
| Design | Replaced on 2026-11-16 by `2026-11-16-storybook-style-3d-map.md` (new colours, font, Thai street, hexagon map). Before that: follow the prototype `thailand-2600.html` | The owner supplied colour charts and reference pictures |
| 3D | A model visitors can rotate (`.glb` file), up to 10 MB | Owner's choice; 10 MB loads in seconds on a phone |
| Phones | Drawing must work well with a finger | Most visitors in Thailand use a phone |
| Picture review | Visible right away, with a report button | Launch is with people we know |
| File storage | A folder on the computer now, Cloudflare R2 later | Free, small to build, and R2 is where Cloudflare hosting keeps files |
| Deadline | None; step by step | |
| Privacy | One plain sentence on the sign-in page now; full policy and consent, checked by a lawyer, before opening to the public | PDPA covers the names and pictures we store |
| Privacy wording | The "What we keep" notice on the sign-in page, Thai and English, approved by the owner on 2026-11-16 | Says what is stored, that posts are public, that solutions go to an AI service, and how to ask for removal |
| Example problems | Keep, labelled "Example" | The site should not look empty |
| How steps are checked | Local preview at phone and desktop size | |

Small technical picks (Claude's, change if you disagree): one picture and one 3D model per pitch; pictures up to
5 MB, shrunk in the browser before upload; drawings saved as a picture; the 3D viewer is Google's free
`model-viewer` (one new package); moderators are listed in the settings file.

## Open questions
| Question | Who answers | Blocks |
|---|---|---|
| ~~Which AI does Rathtakrit have, and how is it called?~~ Answered 2026-11-18: TokenMe, called with one plain `fetch` like his Ten Courts game. See the first-build brief. | Rathtakrit | Done |
| `AGENTS.md` still says the site is for predictions. May that line change? | Rathtakrit | Nothing; the rules file is his |
| The prototype does not show: the 3D viewer, the report button, upload errors. Claude proposes each inside its step for the owner to approve. | Owner | Steps 4 and 6 |
| Should the repo name (thailand-2026) match the site name (Thailand 2600)? | Both | Nothing |
| The privacy notice says "to have your account and posts removed, ask the person who invited you". There is no delete-account button yet; a removal is done by hand in the database. Who handles requests, and is a contact address needed before more people join? | Owner | Opening to the public |
| The privacy notice says solutions go to "an AI service". The AI is now TokenMe: name it? TokenMe's privacy page says it keeps no prompt text; it does not say whether the model behind it keeps or trains on it. | Owner (wording) | Opening to the public |

## Out of scope for this brief
Inbox and email notices, awards and badges, a review queue for approving posts before they show, hosting, the
full privacy policy, predictions.

## Steps
| # | Step | Who | How to check |
|---|---|---|---|
| 0 | Push branch `thailand-2600-app` to GitHub (needs your GitHub sign-in token) | You | The branch shows on github.com |
| 0 | Ask Rathtakrit the two questions above | You | His answers are written into this brief |
| 1 | File storage: uploads saved in a local folder, behind one small piece of code that can later point at R2 | Claude | Upload a test picture; it is still there after a restart |
| 2 | Add a picture to a pitch; it shows on the solution | Claude | Post a pitch with a photo on phone and desktop size |
| 3 | Drawing pad in the pitch form: colours, thickness, undo, draw over a picture | Claude | Draw with a finger at phone size; the drawing shows on the solution |
| 4 | 3D model: upload a `.glb`, rotate it on the solution | Claude | Upload a sample model, spin it on phone and desktop size |
| 5 | "Visualized solutions" tab listing every pitch that has a picture, drawing or model | Claude | The three test pitches appear; each opens its problem |
| 6 | Report button on pictures and models; moderators can remove them | Claude | Report a test picture, remove it as moderator |
| 7 | Privacy sentence on the sign-in page, in Thai and English | Claude writes, you approve the wording | Read it on the sign-in page |

## Done means
Each step is checked in the local preview at phone size and desktop size, by Claude first and then by the owner
with a short list of things to click. The whole brief is done when a person at phone size can post a pitch with a
drawing, a picture or a 3D model, see it in the gallery, and report one.
