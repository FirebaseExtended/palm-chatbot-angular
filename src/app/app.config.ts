import { importProvidersFrom } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { ApplicationConfig } from "@angular/platform-browser";
import { environment } from "src/environments/environment.development";

const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideFirestore(() => getFirestore()),
        )
    ]
};

export default appConfig;