import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AppState} from '../../../../AppState';
import {CommonServices} from '../../../../services/CommonServices';
import {Message} from '../../../../models';

@Component({
    selector: 'app-flash-message', templateUrl: 'flash-message.html', styleUrls: ['flash-message.scss']
})
export class FlashMessageComponent implements OnInit, OnDestroy, OnChanges {

    @Input() message: Message;

    private timeout: any;
    messageContent: any;

    constructor(private commonService: CommonServices) {
    }

    ngOnInit(): void {
        this.timeout = setTimeout(() => {
            this.onClose();
        }, 5000);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.message.content.startsWith('ERROR') || this.message.content.startsWith('INFO')) {
            this.messageContent = 'MESSAGE.' + this.message.content;
        } else {
            this.messageContent = this.message.content;
        }
    }

    ngOnDestroy(): void {
        clearTimeout(this.timeout);
    }

    onClose() {
        this.commonService.hideFlashMessage(this.message);
    }
}
