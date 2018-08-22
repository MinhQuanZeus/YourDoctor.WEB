import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Message, VideoCallHistory} from '../../../../models';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {CommonServices, VideoCallServices} from '../../../../services';

@Component({
    selector: 'app-dialog-confirm-delete',
    templateUrl: 'detail-video-call-modal.component.html',
    styleUrls: ['detail-video-call-model.component.scss']
})

export class DetailVideoCallModalComponent {

    videoCallDetail: VideoCallHistory;

    constructor(private dialogRef: MatDialogRef<DetailVideoCallModalComponent>,
                private videoCallServices: VideoCallServices,
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

    async getReport(id) {
        try {
            const res = await this.videoCallServices.getVideoCallHistoryById(id).toPromise();
            const userRes = res && res.objDetailVideo ? res.objDetailVideo : null;
            if (userRes) {
                this.videoCallDetail = new VideoCallHistory(userRes);
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

}
