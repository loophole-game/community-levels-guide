# Loophole Community Levels Guide
If you've played Loophole and you want to create puzzles of your own, then you're in the right place.
## Quickstart
To develop your own Loophole level, follow these easy steps:
1) Open the [level editor](https://loophole-game.github.io/loophole-level-editor/) in a web browser.
2) After you've designed your level, press `Test Level` to download a json file containing the level's data.
3) In the Loophole game, go to the `Pause Menu` > `Community Levels` > `Play Local Files`.
4) In the file picker, choose the json file you downloaded from the editor.
5) Done! Have fun designing your own Loophole levels.
## Uploading to Steam Workshop
Once you've finished a level, you may want to upload it to Steam Workshop so that others can play it.
1) Ensure that you've added a name and description to the level.
2) Create a preview image that will display on the Workshop page. This should be a 16:9 image in a jpg or png format. This image must be smaller than 1MB.
3) In the Loophole game, go to the `Pause Menu` > `Community Levels` > `Upload to Workshop` > `Upload New Level`.
4) In the first file picker, select a json file (the level data).
5) In the second file picker, select an image file (the preview image).
## Making a Custom Editor
Although we have provided an "official" level editor ([source code here](https://github.com/loophole-game/loophole-level-editor)), the community is welcome to create their own level editors as well. If you are a developer who is interested in this, then your editor must output a json file adhering to [this schema](./levelSchema.ts).
