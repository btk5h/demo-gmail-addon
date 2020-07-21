# Demo Gmail Addon

The official [Cats Quickstart](https://developers.google.com/gsuite/add-ons/cats-quickstart) stripped down to just the
Gmail integration + a development environment using [clasp](https://github.com/google/clasp).

## Prerequisites

* [Node.js](https://nodejs.org/en/)
* [clasp](https://github.com/google/clasp#install) (be sure to run `clasp login` enable the Google Apps Script API
 on your account!)
* (optional) [yarn](https://classic.yarnpkg.com/en/docs/install) or npm 
 
## Development

Run `yarn install` (or `npm install`). This is not required for developing/deploying the app, but it does install
the Apps Script TypeScript type definitions which might be helpful for your IDE :)

## Deployment and Installation

If this is your first time deploying, run `clasp create --type standalone` to initialize an Apps Script project in your
Google account. A `.clasp.json` will be created at the project root to link this repo with the project on your Google
account.

To upload local code to Google, run `clasp push`. Clasp will transpile all the TypeScript files in the project and
upload the output to your Apps Script project.

To install the latest version of the addon to your Google account, run `clasp open` to open the Apps Script project in
your browser. In the toolbar, goto `Publish > Deploy from Manifest...` and click "Install add-on" next to
"Latest Version (Head)". You should only have to do this once. Any subsequent runs of `clasp push` should be immediately
installed to your Google account (though you may need to refresh the Gmail tab).
