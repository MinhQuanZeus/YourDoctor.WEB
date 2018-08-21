import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Message} from '../models';

@Injectable({
    providedIn: 'root',
})
export class CommonServices {
    private messageSubject = new Subject<any>();
    messages: Message[];

    constructor() {
    }

    showFlashMessage(message: Message) {
        if (!this.messages) {
            this.messages = [];
        }
        const temp = this.messages.filter(obj => obj.id === message.id);
        if (temp.length === 0) {
            this.messages.push(message);
            this.messageSubject.next(this.messages);
        }
    }

    hideFlashMessage(message: Message) {
        if (!this.messages) {
            return;
        }
        this.messages = this.messages.filter(obj => obj.id !== message.id);
        this.messageSubject.next(this.messages);
    }

    flashMessage(): Observable<any> {
        return this.messageSubject.asObservable();
    }
}
