import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {Banking, Message} from '../../../../models';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {BankingServices, CommonServices, ReportServices} from '../../../../services';
import {UserDetailComponent} from '../../../user-detail/components';

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

    constructor(private dialogRef: MatDialogRef<BankingDetailComponent>,
                private commonServices: CommonServices, private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any, private bankingServices: BankingServices) {
        this.getBankingDateil(data.id);
    }

    public ok() {
        this.dialogRef.close('ok');
    }

    public cancel() {
        this.dialogRef.close();
    }

    changeSolution(value) {
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
        this.invoice = event && event.target && event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
        if (this.invoice) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.invoiceSrc = (<FileReader>e.target).result;
            };
            reader.readAsDataURL(this.invoice);
        }
    }

    openDetail() {
    }

    async getBankingDateil(id) {
        try {
            const res = await this.bankingServices.getById(id).toPromise();
            const userRes = res && res.objDetail ? res.objDetail : null;
            if (userRes) {
                this.bankingDetail = new Banking(userRes);
                this.comment = this.bankingDetail.comment;
                this.invoiceSrc = this.bankingDetail.invoice;
                this.status = this.bankingDetail.status;
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

}
