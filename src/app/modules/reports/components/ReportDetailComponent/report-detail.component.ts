import {Component, Inject, Injectable} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material';
import {Message, Report, User} from '../../../../models';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {CommonServices, ReportServices} from '../../../../services';
import {UserDetailComponent} from '../../../user-detail/components';
import {DetailChatModalComponent} from '../../../core/components/DetailChatComponent/detail-chat-modal.component';
import {DetailVideoCallModalComponent} from '../../../core/components';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-report-detail',
    templateUrl: 'report-detail.component.html',
    styleUrls: ['report-detail.component.scss']
})

export class ReportDetailComponent {

    report: Report;
    solution = -1;

    constructor(private dialogRef: MatDialogRef<ReportDetailComponent>,
                private commonServices: CommonServices, private dialog: MatDialog,
                private spinner: NgxSpinnerService,
                @Inject(MAT_DIALOG_DATA) public data: any, private reportServices: ReportServices) {
        this.getReport(data.id);
    }

    public ok() {
        this.updateReport();
    }

    public cancel() {
        this.dialogRef.close();
    }

    changeSolution(value) {
        this.solution = value;
    }

    openUserDetail(userId) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: userId,
            type: 2
        };
        const dialogRef = this.dialog.open(UserDetailComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {

            }
        });
    }

    openDetail() {
        if (this.report.type === 1) {
            this.openDetailChat(this.report.idConversation);
        } else if (this.report.type === 2) {
            this.openDetailVideoCall(this.report.idConversation);
        }
    }

    openDetailChat(idChat) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: idChat,
        };
        const dialogRef = this.dialog.open(DetailChatModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {

            }
        });
    }

    openDetailVideoCall(idVideoCall) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: idVideoCall,
        };
        const dialogRef = this.dialog.open(DetailVideoCallModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {

            }
        });
    }

    async getReport(id) {
        try {
            this.spinner.show();
            const res = await this.reportServices.getById(id).toPromise();
            this.spinner.hide();
            const userRes = res && res.report ? res.report : null;
            if (userRes) {
                this.report = new Report(userRes);
                this.solution = this.report.punish ? this.report.punish : -1;
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async updateReport() {
        try {
            this.spinner.show();
            const body = {
                id: this.report.id,
                idPersonBeingReported: this.report.personBeingReported.id,
                type: this.solution
            };
            const res = await this.reportServices.updateReport(body).toPromise();
            this.spinner.hide();
            if (res) {
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(),
                    type: 'SUCCESS', content: 'Đã xử lý report thành công'}));
                this.dialogRef.close('ok');
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

}
