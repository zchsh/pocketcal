# Zach's notes for a weird lil PocketCal fork situation

- I like PocketCal a lot
- I wanna use it to settle on dates for group activities, like you would with https://timeful.app/, https://pollendar.com, https://doodle.com/en/, etc...
- Data-in-URL is _awesome_, no database needed, easy to host the app free, etc...
- But the downside is that for group events, passing a URL around can get _really complicated_ - if you want to see the whole group's availability in one calendar, you kinda have to pass the URL around in a perfect sequence. And, everyone has to kind of understand how data-in-URL storage works for this to feel intuitive.
- An alternative that popped into my head today is... maybe the interface for PocketCal could support _pasting a PocketCal URL_ as a way to add a bunch of data? Basically merging two PocketCals together?
- With the above feature in place, for scheduling group activities, everyone would make their own calendar URL with their availability - simple enough, no co-ordination needed. Then, whoever's hosting or organizing--or really anyone in a group chat or whatever--can gather up all the individual calendar URLs, paste em back into PocketCal, and voilà there's a link with everyone's availability.
- 2026-04-20 at 14:38 - gettin' there... i'm probably not handling all the subtleties of form accessibility very well, but for now, feels good enough to share with some folks and see if it's useful.

## Local development

I'm rusty and I feel like I barely now React anymore so I'm writin' stuff down.

- Clone this repo
- Run `npm i`
- Run `make dev`
