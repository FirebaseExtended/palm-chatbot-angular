# PalmApiApp

A demo app to show how to use Firebase, Angular, and the PaLM API to create a customizable chat bot.

## Get started

1. [Create a Firebase project](https://firebase.google.com/docs/web/setup#create-project)
2. [Register a new web app with Firebase Hosting](https://firebase.google.com/docs/web/setup#register-app)
3. In the Firebase console, enable Cloud Firestore
4. Install the [Chatbot with PaLM API extension](https://extensions.dev/extensions/googlecloud/firestore-palm-chatbot)
5. Clone this repo into your local directory
6. `npm install` to install dependencies
7. Add the web app config object from the Firebase console in `src/environments/environment.ts` and `src/environments/environment.development.ts` files.
8. Use the [Angular CLI](https://angular.io/cli) to run `ng add @angular/fire --project=[YOUR PROJECT_NAME]`
9. `ng deploy` to compile your project and deploy to your hosting URL

Your chatbot is deployed to Firebase, and ready to use!

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy

Run `ng deploy` to deploy the project to your hosting website. Navigate to the provided Hosting URL to try out your chatbot.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
