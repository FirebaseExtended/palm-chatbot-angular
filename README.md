# PalmApiApp

A demo app to show how to use Firebase, Angular, and the PaLM API to create a customizable chat bot.

## Get started

1. [Create a Firebase project](https://firebase.google.com/docs/web/setup#create-project)
1. In the Firebase console, enable Cloud Firestore
1. Install the [Chatbot with PaLM API extension](https://extensions.dev/extensions/googlecloud/firestore-palm-chatbot)
1. [Register a new web app](https://firebase.google.com/docs/web/setup#register-app)
1. Add the web app config object from the Firebase console in `src/environments/environment.ts` and `src/environments/environment.development.ts`
1. `npm install`
1. Start the development server

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
