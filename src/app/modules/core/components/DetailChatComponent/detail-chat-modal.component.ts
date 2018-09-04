import {Component, Inject, Injectable} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material';
import {Chat, Message, Report} from '../../../../models';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {ChatServices, CommonServices} from '../../../../services';
import {ImageViewModalComponent} from '../ImageViewModalComponent/image-view-modal.component';

@Component({
    selector: 'app-dialog-confirm-delete',
    templateUrl: 'detail-chat-modal.component.html',
    styleUrls: ['detail-chat-model.component.scss']
})

export class DetailChatModalComponent {

    chatDetail: Chat;
    panelOpenState = true;

    constructor(private dialogRef: MatDialogRef<DetailChatModalComponent>,
                private chatServices: ChatServices,
                private dialog: MatDialog,
                private commonServices: CommonServices,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        if (data && data.id) {
            this.getReport(data.id);
        }
    }

    public ok() {
        this.dialogRef.close('ok');
    }

    public cancel() {
        this.dialogRef.close();
    }

    public previewImage(data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            image: data
        };
        const dialogRef = this.dialog.open(ImageViewModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    async getReport(id) {
        try {
            const res = await this.chatServices.getChatTopicById(id).toPromise();
            const userRes = res && res.objConversation ? res.objConversation : null;
            if (userRes) {
                this.chatDetail = new Chat(userRes);
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    trackByFn(index, item) {
        return index;
    }

}
