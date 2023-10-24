/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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