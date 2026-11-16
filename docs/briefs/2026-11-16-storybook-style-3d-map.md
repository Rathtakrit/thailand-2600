# Brief: storybook style and a 3D province map

From the owner's request on 2026-11-16, with three reference pictures (a night street in purple, teal and
magenta; a night fair with glowing tents; a sunny medieval town in sand, terracotta and blue). This reopens the
"Design: follow the prototype" decision in `2026-11-16-drawings-3d-gallery.md`. Steps 6 and 7 of that brief
(report button, privacy sentence) wait until this one is done.

## Idea
In the owner's words: "I want the Thailand map to be 3D model which doesn't need to be much detail, I want it can
rotate around and show simple symbol of each province in cute style. I want website to look a bit futuristic and
use color and graphic like image I show."

## Decisions (2026-11-16)
| Topic | Decision | Why |
|---|---|---|
| 3D map | 77 provinces as small rounded blocks arranged in Thailand's shape; drag to rotate | Light enough for phones, needs no downloaded map data, easy to change |
| Province symbols | Claude proposes one thing per province and draws it as a simple flat icon; owner and teammate approve the list first | A wrong symbol for a province would be noticed by people who live there |
| Colours | Light mode is "day" (sand, terracotta, sky blue); dark mode is "night" (deep purple, teal, magenta, warm glowing windows) | Uses both moods of the references; follows each visitor's phone setting |
| Graphics | New colours everywhere, the 3D map, and one drawn skyline band at the top of pages | Storybook feel without making text hard to read |
| Reference pictures | Used for colour and mood only; nothing is traced or copied | They are other artists' work |

Small technical picks (Claude's): the map is drawn with `three`, the 3D code that the model viewer already
brought into the project, so no new download; the skyline is flat shapes drawn in code (SVG), not image files;
fonts stay as they are.

## Open questions
| Question | Who answers | Blocks |
|---|---|---|
| The 77 symbols: is each one right for its province? | Owner and Rathtakrit | Step 4 |
| Problems are filed by region today (North, Isan and so on). Should "Name a problem" ask for a province instead? Claude's suggestion: for now tapping a province filters to its region; add provinces to problems as a later step. | Owner | Nothing in this brief |
| "A bit futuristic": the references are storybook, not futuristic. Claude's reading: clean shapes, glowing accents at night, the squared display font already in use. Say if you want more (for example flying vehicles in the skyline). | Owner | Step 2 |

## Out of scope
Illustrated backgrounds on every page, animated characters, real province borders, changing the fonts,
re-filing existing problems by province.

## Steps
| # | Step | Who | How to check |
|---|---|---|---|
| 1 | New colours for day and night across the whole site | Claude | Every page at phone and desktop size, in light and dark mode; text is easy to read |
| 2 | Drawn skyline band in the page top: rooftops and bunting by day, moon and glowing windows by night | Claude | Home page in both modes |
| 3 | Province list: all 77 with region, position on the block map and a proposed symbol, as a table for approval | Claude writes, you and Rathtakrit approve | Read the table; mark any wrong symbol |
| 4 | 3D block map: rotate by dragging, tap a province to filter, plain dots until symbols are approved | Claude | Rotate and tap at phone and desktop size; a flat list of regions stays for people who cannot use the 3D map |
| 5 | Draw the approved symbols and place them on the blocks | Claude | Each province shows its symbol; names appear on tap |

## Done means
A visitor on a phone sees the storybook colours in their own light or dark setting, can turn the 3D map with a
finger, can tell provinces apart by their symbols, and can still read and use every page. People who use a
keyboard or screen reader can filter by place without the 3D map.
