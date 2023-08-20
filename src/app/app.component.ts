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
      <p>{{status}}</p>
      {{response}}
    </form>
  `,
  styleUrls: ['./app.component.css'],
  imports: []
})
export class AppComponent {
  private readonly firestore: Firestore = inject(Firestore);
  private readonly discussionCollection = collection(this.firestore, 'discussions');
  title = 'palm-api-app';
  response = '';
  prompt = '';
  status = '';

  async submitPrompt(event: Event, promptText: HTMLInputElement) {
    event.preventDefault();

    if (!promptText.value) return;
    this.prompt = promptText.value;
    promptText.value = '';

    this.status = 'sure, one sec';
    const discussionDoc = await addDoc(this.discussionCollection, { prompt: this.prompt });

    const destroyFn = onSnapshot(discussionDoc, {
      next: snap => {
        const conversation = snap.data();
        if (conversation && conversation['status']) {
          this.status = 'thinking...';
          if (conversation['status']['state'] === 'COMPLETED') {
            this.status = 'here you go!';
            this.response = conversation['response'];
            destroyFn();
          }
        }
      },
    })
  }
}
