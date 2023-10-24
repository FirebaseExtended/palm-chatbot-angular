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

import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collection, getDoc, onSnapshot } from '@angular/fire/firestore';
import { addDoc, doc } from '@firebase/firestore';

interface DisplayMessage {
  text: string;
  type: 'PROMPT' | 'RESPONSE';
}

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <header>
      <h1>Firebase 🤝 Palm API 🤝 Angular</h1>
    </header>
    <section class="conversation-window">
      <section class="responses">
        <ng-container *ngFor="let resp of responses">
          <div [ngClass]="resp.type == 'PROMPT' ? 'prompt' : 'response'">
            <img
              *ngIf="resp.type != 'PROMPT'"
              class="chatbot-logo"
              src="/assets/firestore-palm-chatbot-logo.png"
            />
            <p>{{ resp.text }}</p>
          </div>
        </ng-container>
      </section>
      <section class="prompt-area">
        <form *ngIf="!status" class="prompt-form">
          <input
            autofocus
            class="prompt-input"
            type="text"
            name="prompt"
            #promptText
            placeholder="Enter a prompt here"
          />
          <button
            class="prompt-send-button"
            (click)="submitPrompt($event, promptText)"
          >
            Send
          </button>
        </form>
        <div *ngIf="status" class="status-indicator">
        <p>{{ status }}</p>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .prompt-controls {
        display: flex;
      }
      header > h1 {
        font-size: 20pt;
      }
      header {
        margin-bottom: 15px;
      }
      .prompt, .response {
        padding: 20px;
        max-width: 80%;
        border-radius: 10px;
        border: solid 5px white;
        margin-bottom: 10px;
        line-height: 1.5;
      }
      .prompt {
        margin-left: auto;
      }
      .response {
        background: white;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }
      .responses {
        border-radius: 10px;
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        overflow-y: scroll;
      }
      .prompt-area {
        border-radius: 10px;
      }
      .prompt-form {
        display: flex;
        flex-flow: row nowrap;
      }
      .prompt-input {
        flex-grow: 9;
        margin-right: 20px;
        padding: 20px;
        border-radius: 10px;
        border: none;
      }
      .prompt-send-button {
        flex-grow: 0;
        flex-shrink: 0;
        border-radius: 50%;
        height: 56px;
        width: 56px;
        border: 2px solid black;
      }
      .conversation-window {
        padding: 20px;
        background: #f3f6fc;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: calc(100vh - 150px);
      }
      .chatbot-logo {
        height: 56px;
        width: 56px;
        margin-right: 20px;
      }
      .status-indicator {
        padding: 20px;
        display: flex;
        justify-content: space-evenly
      }
    `,
  ],
  imports: [NgFor, NgClass, NgIf],
})
export class AppComponent {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly discussionCollection = collection(this.firestore, 'discussions');
  title = 'palm-api-app';
  prompt = '';
  status = '';
  errorMsg = '';
  responses: DisplayMessage[] = [
    {
      text: "I'm a chatbot powered by the Palm API Firebase Extension and built with Angular.",
      type: 'RESPONSE' 
    }
  ];

  async submitPrompt(event: Event, promptText: HTMLInputElement) {
    event.preventDefault();

    if (!promptText.value) return;
    this.prompt = promptText.value;
    promptText.value = '';
    this.responses.push({
      text: this.prompt,
      type: 'PROMPT',
    });

    this.status = 'sure, one sec';
    const discussionDoc = await addDoc(this.discussionCollection, { prompt: this.prompt });

    const destroyFn = onSnapshot(discussionDoc, {
      next: snap => {
        const conversation = snap.data();
        if (conversation && conversation['status']) {
          this.status = 'thinking...';
          const state = conversation['status']['state'];

          switch (state) {
            case 'COMPLETED':
              this.status = '';
              this.responses.push({
                text: conversation['response'],
                type: 'RESPONSE',
              });
              destroyFn();
              break;
            case 'PROCESSING':
              this.status = 'preparing your answer...';
              break;
            case 'ERRORED':
              this.status = 'Oh no! Something went wrong. Please try again.';
              destroyFn();
              break;
          }
        }
      },
      error: err => {
        console.log(err);
        this.errorMsg = err.message;
        destroyFn();
      }
    })
  }
}
