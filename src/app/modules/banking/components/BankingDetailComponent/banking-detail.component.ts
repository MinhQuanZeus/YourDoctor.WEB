import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {Banking, Message} from '../../../../models';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {BankingServices, CommonServices, ReportServices} from '../../../../services';
import {UserDetailComponent} from '../../../user-detail/components';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-banking-detail',
    templateUrl: 'banking-detail.component.html',
    styleUrls: ['banking-detail.component.scss']
})

export class BankingDetailComponent {

    bankingDetail: Banking;
    invoice: File;
    invoiceSrc: string;
    comment: string;
    status: number;

    isErrorInvoice = false;
    isErrorComment = false;
    isErrorStatus = false;

    constructor(private dialogRef: MatDialogRef<BankingDetailComponent>,
                private spinner: NgxSpinnerService,
                private commonServices: CommonServices, private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any, private bankingServices: BankingServices) {
        this.getBankingDateil(data.id);
    }

    public ok() {
        if (!this.status || this.status === 1 || this.status === 2) {
            this.isErrorStatus = true;
        }
        if (!this.invoice) {
            this.isErrorInvoice = true;
        }
        this.comment = this.comment ? this.comment.trim() : '';
        if (!this.comment) {
            this.isErrorComment = true;
        }
        if (!this.isErrorStatus && !this.isErrorInvoice && !this.isErrorComment) {
            const formData = new FormData();
            if (this.invoice) {
                formData.append('evidence', this.invoice);
            }
            formData.append('body', JSON.stringify({
                status: this.status,
                note: this.comment
            }));
            this.updateBankDetail(formData, this.bankingDetail.id);
        }
    }

    onInputComment() {
        if (!this.comment || !this.comment.trim()) {
            this.isErrorComment = true;
        } else {
            this.isErrorComment = false;
        }
    }

    public cancel() {
        this.dialogRef.close();
    }

    changeSolution(value) {
        this.isErrorStatus = false;
        this.status = value;
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

    onImageChange(event) {
        this.isErrorInvoice = false;
        this.invoice = event && event.target && event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
        if (this.invoice) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.invoiceSrc = (<FileReader>e.target).result;
            };
            reader.readAsDataURL(this.invoice);
        }
        event.target.files = null;
    }

    onDelete() {
        this.invoice = null;
        this.invoiceSrc = '../../../../../assets/images/no-image-icon.png';
    }

    openDetail() {
    }

    async getBankingDateil(id) {
        try {
            this.spinner.show();
            const res = await this.bankingServices.getById(id).toPromise();
            this.spinner.hide();
            const userRes = res && res.objDetail ? res.objDetail : null;
            if (userRes) {
                this.bankingDetail = new Banking(userRes);
                this.comment = this.bankingDetail.comment;
                this.invoiceSrc = this.bankingDetail.invoice;
                this.status = this.bankingDetail.status;
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async updateBankDetail(data, id) {
        try {
            const response = await this.bankingServices.updateBank(data, id).toPromise();
            if (response) {
                this.dialogRef.close('ok');
                this.commonServices.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã lưu thành công '}));
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }
}
