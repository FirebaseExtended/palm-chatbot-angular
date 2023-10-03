import { FirebaseOptions } from '@angular/fire/app';

const prodFirebaseConfig = {
  // Add the Firebase config object for your web app here
  // https://support.google.com/firebase/answer/7015592?hl=en#web&zippy=%2Cin-this-article
};

export const environment: { firebase: FirebaseOptions } = {
  firebase: prodFirebaseConfig,
};
