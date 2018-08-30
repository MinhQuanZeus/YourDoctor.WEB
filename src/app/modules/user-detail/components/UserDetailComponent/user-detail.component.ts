import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {BankingServices, ChatServices, CommonServices, PaymentServices, UserServices, VideoCallServices} from '../../../../services';
import {Message, User, VideoCallHistory, ChatHistory, PaymentHistory, Banking} from '../../../../models';
import {HttpErrorResponse} from '@angular/common/http';
import {ImageViewModalComponent} from '../../../core/components';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-dialog-user-detail',
    templateUrl: 'user-detail.component.html',
    styleUrls: ['user-detail.component.scss']
})

export class UserDetailComponent {
    initData = {
        id: null,
        role: null
    };
    userInfo = new User();
    chatHistories: ChatHistory[];
    videoCallHistories: VideoCallHistory[];
    paymentHistories: PaymentHistory[];
    bankingHistories: Banking[];
    type = 1;

    systemRatting = 0;
    status = 1;

    constructor(private dialogRef: MatDialogRef<UserDetailComponent>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
                private commonServices: CommonServices, private userServices: UserServices, private bankingServices: BankingServices,
                private spinner: NgxSpinnerService,
                private videoCallHistoryServices: VideoCallServices, private paymentHistoryServices: PaymentServices,
                private chatServices: ChatServices) {
        this.initData = data;
        this.type = data.type;
        if (this.initData) {
            this.getUserInfo();
        }
    }

    public ok() {
        this.updateUser();
    }

    public cancel() {
        this.dialogRef.close();
    }

    public previewImage(data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        const dialogRef = this.dialog.open(ImageViewModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    onChangeStatus(value) {
        this.status = value;
    }
    onChangeSystemRatting(value) {
        this.systemRatting = value;
    }

    async getUserInfo() {
        try {
            this.spinner.show();
            const res = await this.userServices.getUserById(this.initData.id).toPromise();
            const userRes = res && res.user ? res.user : null;
            const moreDetail = res && res.moreDoctorDetail ? res.moreDoctorDetail : null;
            if (userRes) {
                this.userInfo = new User(userRes);
                this.userInfo.doctorDetail = moreDetail;
                if (this.userInfo.role === 1 || this.userInfo.role === 2) {
                    this.status = this.userInfo.status;
                    this.systemRatting = this.userInfo.role === 2 ? this.userInfo.doctorDetail.systemRating : 0;
                    await this.getChatHistory(this.userInfo);
                    await this.getVideoCallHistory(this.userInfo);
                    await this.getPaymentHistories(this.userInfo);
                }
                if (this.userInfo.role === 4) {
                    await this.getPaymentHistories(this.userInfo);
                }
                if (this.userInfo.role === 2) {
                    await this.getBankHistories(this.userInfo);
                }
            }
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async getChatHistory(user: User) {
        try {
            let historiesPatientRes = null;
            let historiesDoctorRes = null;
            let resPatient = null;
            let resDoctor = null;
            if (user && user.role === 2) {
                resDoctor = await this.chatServices.getDoctorChatHistories(user.id).toPromise();
                // resPatient = await this.chatServices.getPattientChatHistories(user.id).toPromise();
                historiesDoctorRes = resDoctor && resDoctor.listChatsHistory ? resDoctor.listChatsHistory : null;
                // historiesPatientRes = resPatient && resPatient.listChatsHistory ? resPatient.listChatsHistory : null;
            } else if (user && user.role === 1) {
                resPatient = await this.chatServices.getPattientChatHistories(user.id).toPromise();
                historiesPatientRes = resPatient && resPatient.listChatsHistory ? resPatient.listChatsHistory : null;
            }
            if (historiesDoctorRes && historiesDoctorRes.length > 0) {
                this.chatHistories = historiesDoctorRes.map(obj => new ChatHistory(obj));
            }
            if (historiesPatientRes && historiesPatientRes.length > 0) {
                this.chatHistories = historiesPatientRes.map(obj => new ChatHistory(obj));
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async getVideoCallHistory(user: User) {
        try {
            let historiesPatientRes = null;
            let historiesDoctorRes = null;
            let resPatient = null;
            let resDoctor = null;
            if (user && user.role === 2) {
                resDoctor = await this.videoCallHistoryServices.getDoctorVideoCallHistories(user.id).toPromise();
                // resPatient = await this.chatServices.getPattientChatHistories(user.id).toPromise();
                historiesDoctorRes = resDoctor && resDoctor.listVideoCallHistory ? resDoctor.listVideoCallHistory : null;
                // historiesPatientRes = resPatient && resPatient.listVideoCallHistory ? resPatient.listVideoCallHistory : null;
            } else if (user && user.role === 1) {
                resPatient = await this.videoCallHistoryServices.getPattientVideoCallHistories(user.id).toPromise();
                historiesPatientRes = resPatient && resPatient.listVideoCallHistory ? resPatient.listVideoCallHistory : null;
            }
            if (historiesDoctorRes && historiesDoctorRes.length > 0) {
                this.videoCallHistories = historiesDoctorRes.map(obj => new VideoCallHistory(obj));
            }
            if (historiesPatientRes && historiesPatientRes.length > 0) {
                this.videoCallHistories = historiesPatientRes.map(obj => new VideoCallHistory(obj));
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async getPaymentHistories(user: User) {
        try {
            let historiesRes = null;
            let res = null;
            if (user && user.role === 2 || user.role === 1 || user.role === 4) {
                res = await this.paymentHistoryServices.getPaymentHistoriesByUserId(user.id).toPromise();
                historiesRes = res && res.listPaymentHistory ? res.listPaymentHistory : null;
            }
            if (historiesRes && historiesRes.length > 0) {
                this.paymentHistories = historiesRes.map(obj => new PaymentHistory(obj));
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async getBankHistories(user: User) {
        try {
            let historiesRes = null;
            let res = null;
            if (user && user.role === 2 || user.role === 1) {
                res = await this.bankingServices.getBankingHistoriesByUserId(user.id).toPromise();
                historiesRes = res && res.listBankingHistory ? res.listBankingHistory : null;
            }
            if (historiesRes && historiesRes.length > 0) {
                this.bankingHistories = historiesRes.map(obj => new Banking(obj));
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async updateUser() {
        try {
            const data = {
                id: this.userInfo.id,
                status: this.status,
                systemRating: this.systemRatting
            };
            const response = await this.userServices.updateUser(data).toPromise();
            if (response) {
                this.dialogRef.close('ok');
                this.commonServices.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã lưu thành công ' + this.userInfo.fullName}));
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
