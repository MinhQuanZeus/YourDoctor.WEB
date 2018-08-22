import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MatPaginator} from '@angular/material';
import {CommonServices, UserServices} from '../../../../services/';
import {Message, User} from '../../../../models';
import {DeletionConfirmModalComponent} from '../../../core/components';
import {StaffRegisterComponent} from '../StaffRegisterComponent/staff-register.component';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {UserDetailComponent} from '../../../user-detail/components';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    displayedColumns = ['userId', 'userName', 'progress', 'color'];
    rows: User[];

    @ViewChild(MatPaginator) paginator1: MatPaginator;
    @ViewChild('keyWord') keyWord: ElementRef;
    pageLength = 0;
    pageSize = 15;
    @Input() status;
    @Input() actionStatus;
    @Output() edit = new EventEmitter();
    @Output() delete = new EventEmitter();
    @Output() view = new EventEmitter();
    @Output() page = new EventEmitter();
    @Output() sort = new EventEmitter();
    @Output() dup = new EventEmitter();

    model: any;
    userList: User[];
    userDelete: any;

    header = [
        {
            name: 'Số điện thoại',
            key: 'phoneNumber',
            order: 'asc'
        },
        {
            name: 'Họ tên',
            key: 'fullName',
            order: 'asc'
        },
        {
            name: 'Vai trò',
            key: 'roleString',
            order: 'asc'
        },
        {
            name: 'Trạng thái',
            key: 'statusString',
            order: 'asc'
        }
    ];

    constructor(private userServices: UserServices, private dialog: MatDialog, private commonService: CommonServices) {
        this.model = {
            search_keyword: null,
            status: 0,
            role: 0,
            sort_key: null,
            sort_direction: null
        };
        this.rows = [];
        this.getUserlist();
    }

    ngOnInit() {
        this.getRows();
    }

    next(event) {
        this.rows = [];
        if ((event.pageIndex + 1) * event.pageSize > event.length) {
            for (let i = 1 * event.pageIndex * event.pageSize; i < event.length; i++) {
                this.rows = [...this.rows, this.userList[i]];
            }
        } else {
            for (let i = 1 * event.pageIndex * event.pageSize; i < event.pageSize + event.pageIndex * event.pageSize; i++) {
                this.rows = [...this.rows, this.userList[i]];
            }
        }
    }

    getRows() {
        if (!this.userList) {
            return;
        }
        this.rows = [];
        if (this.pageSize < this.userList.length) {
            for (let i = 0; i < this.pageSize; i++) {
                this.rows = [...this.rows, this.userList[i]];
            }
        } else {
            for (let i = 0; i < this.userList.length; i++) {
                this.rows = [...this.rows, this.userList[i]];
            }
        }
        this.pageLength = this.userList.length;
    }

    sortData(val) {
        this.model.sort_key = val.active;
        this.model.sort_direction = val.direction;
        this.getUserlist();
    }

    onConfirmDelete(user) {
        this.userDelete = user;
        this.openModal();
    }

    onChangeStatus(status) {
        this.model.status = status;
        this.getUserlist();
    }

    onEnterSearchKey() {
        this.keyWord.nativeElement.blur();
    }

    onBlurKeyWord() {
        this.getUserlist();
    }


    onChangeRole(role) {
        this.model.role = role;
        this.getUserlist();
    }

    openModal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: 'Xóa người dùng',
            message: 'Bạn có muốn xóa ' + this.userDelete.fullName + '?'
        };
        const dialogRef = this.dialog.open(DeletionConfirmModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {
                this.deleteUser();
            }
        });
    }

    openDetail(row) {
        const deleteUser = this.userList.filter(obj => obj.phoneNumber === row.phoneNumber);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: deleteUser[0].id,
            role: deleteUser[0].role
        };
        const dialogRef = this.dialog.open(UserDetailComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {
                this.getUserlist();
            }
        });
    }

    onCreateNewStaff() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};
        const staffRegisterRef = this.dialog.open(StaffRegisterComponent, dialogConfig);
        staffRegisterRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {
                this.getUserlist();
            }
        });
    }

    async getUserlist(): Promise<any> {
        try {
            const response = await this.userServices.getUsers(this.model).toPromise();
            const listUser = response && response.listUser;
            this.userList = [];
            if (listUser && listUser.length > 0) {
                this.userList = listUser.map(obj => new User(obj));
            }
            this.getRows();
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({ id: new Date().getTime(), type: 'ERROR', content: error }));
            }
        }
    }

    async deleteUser(): Promise<any> {
        try {
            const deleteUser = this.userList.filter(obj => obj.phoneNumber === this.userDelete.phoneNumber);
            const response = await this.userServices.deleteUser(deleteUser[0]).toPromise();
            const status = response && response.status;
            if (status) {
                this.getUserlist();
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({ id: new Date().getTime(), type: 'ERROR', content: error }));
            }
        }
    }
}
