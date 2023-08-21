import { Component, inject } from '@angular/core';
import { Firestore, collection, getDoc, onSnapshot } from '@angular/fire/firestore';
import { addDoc, doc } from '@firebase/firestore';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <h1>Palm API demo</h1>
    <form>
      <label for="prompt"><p>Please enter a prompt:</p></label>
      <input type="text" name="prompt" #promptText>
      <button (click)="submitPrompt($event, promptText)">Submit</button>
      <hr />
      <p>{{status}}<span class="error">{{errorMsg}}</span></p>
      {{response}}
    </form>
  `,
  styles: [
    `{
      color: red;
    }`
  ],
  imports: []
})
export class AppComponent {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly discussionCollection = collection(this.firestore, 'discussions');
  title = 'palm-api-app';
  response = '';
  prompt = '';
  status = '';
  errorMsg = '';

  async submitPrompt(event: Event, promptText: HTMLInputElement) {
    event.preventDefault();

    if (!promptText.value) return;
    this.prompt = promptText.value;
    promptText.value = '';
    this.response = '';

    this.status = 'sure, one sec';
    const discussionDoc = await addDoc(this.discussionCollection, { prompt: this.prompt });

    const destroyFn = onSnapshot(discussionDoc, {
      next: snap => {
        const conversation = snap.data();
        if (conversation && conversation['status']) {
          this.status = 'thinking...';
          const state = conversation['status']['state'];

          switch(state) {
            case 'COMPLETED':
              this.status = 'here you go!';
              this.response = conversation['response'];
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
