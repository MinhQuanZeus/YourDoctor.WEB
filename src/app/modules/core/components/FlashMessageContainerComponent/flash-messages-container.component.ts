import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {animate, state, style, transition, trigger} from '@angular/animations';
import {CommonServices} from '../../../../services/CommonServices';

@Component({
    selector: 'app-flash-messages',
    templateUrl: 'flash-messages.html',
    styleUrls: ['flash-messages.scss'],
    animations: [
        trigger('flyInOut', [
            state('in', style({ opacity: 1, transform: 'translateX(0)' })),
            transition('void => *', [
                style({
                    opacity: 0,
                    transform: 'translateX(-50%)'
                }),
                animate('0.75s 0.1s ease-in')
            ]),
            transition('* => void', [
                animate('0.75s 0.1s ease-out', style({
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ])
        ])
    ]
})
export class FlashMessageContainerComponent {

    messages$: Observable<any>;

    constructor(private commonServices: CommonServices) {
        this.messages$ = this.commonServices.flashMessage();
    }
}
