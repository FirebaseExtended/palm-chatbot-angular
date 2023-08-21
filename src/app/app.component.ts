import { NgClass, NgFor } from '@angular/common';
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
      <h1>Palm API 🤝 Angular</h1>
    </header>
    <section class="conversation-window">
      <section class="responses">
        <p class="response">I'm chatbot powered by the Palm API Firebase Extension and built with Angular.</p>
        <ng-container *ngFor="let resp of responses">
          <p [ngClass]="resp.type == 'PROMPT' ? 'prompt' : 'response'">{{ resp.text }}</p>
        </ng-container>
      </section>
      <section class="prompt-area">
        <form>
          <label for="prompt"><p>Please enter a prompt:</p></label>
          <input type="text" name="prompt" #promptText placeholder="Enter a prompt here">
          <button (click)="submitPrompt($event, promptText)">Send</button>
        </form>
        <p>{{ status }}</p>
      </section>
    </section>
  `,
  styles: [
    `
      header > h1 {
        font-size: 20pt;
      }
      header {
        margin-bottom: 15px;
      }
      .prompt, .response {
        padding: 20px;
      }
      .prompt {
        /* background: #f3f6fc; */
      }
      .response {
        background: white;
        border-radius: 10px;
        border: solid 5px white;
      }
      .responses {
        border-radius: 10px;
        margin-bottom: 15px;
      }
      .prompt-area {
        border-radius: 10px;
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
    `
  ],
  imports: [NgFor, NgClass]
})
export class AppComponent {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly discussionCollection = collection(this.firestore, 'discussions');
  title = 'palm-api-app';
  prompt = '';
  status = '';
  errorMsg = '';
  responses: DisplayMessage[] = [];

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
              this.status = 'here you go!';
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
