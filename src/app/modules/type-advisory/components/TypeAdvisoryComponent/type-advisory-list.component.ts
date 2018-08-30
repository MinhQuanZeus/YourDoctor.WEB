import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator} from '@angular/material';
import {CommonServices, TypeAdvisoryServices} from '../../../../services/';
import {Message, TypeAdvisory} from '../../../../models';
import {DeletionConfirmModalComponent} from '../../../core/components';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {CreateTypeAdvisoryComponent} from '../CreateTypeAdvisoryComponent/create-type-advisory.component';
import {UpdateTypeAdvisoryComponent} from '../UpdateTypeAdvisoryComponent/update-type-advisory.component';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-type-advisory-list',
    templateUrl: 'type-advisory-list.component.html',
    styleUrls: ['type-advisory-list.component.scss']
})
export class TypeAdvisoryListComponent implements OnInit {

    rows: TypeAdvisory[];

    @ViewChild(MatPaginator) paginator1: MatPaginator;
    @ViewChild('keyWord') keyWord: ElementRef;
    pageLength = 0;
    pageSize = 15;
    model: any;
    typeList: TypeAdvisory[];
    itemDelete: TypeAdvisory;
    sortedlist: TypeAdvisory[];
    status = false;
    header = [
        {
            name: 'Tên',
            key: 'name',
            order: 'asc'
        },
        {
            name: 'Loại tư vấn',
            key: 'typeString',
            order: 'asc'
        },
        {
            name: 'Giá',
            key: 'price',
            order: 'asc'
        },
        {
            name: 'Giới hạn',
            key: 'limitNumberRecords',
            order: 'asc'
        },
        {
            name: 'Mô tả',
            key: 'description',
            order: 'asc'
        }
    ];

    constructor(private typeAdvisoryServices: TypeAdvisoryServices,
                private spinner: NgxSpinnerService, private dialog: MatDialog, private commonService: CommonServices) {
        this.model = {
            sort: {
                active: 'name',
                direction: 'desc'
            },
            pageIndex: 0
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
                this.rows = [...this.rows, this.sortedlist[i]];
            }
        } else {
            for (let i = 1 * event.pageIndex * event.pageSize; i < event.pageSize + event.pageIndex * event.pageSize; i++) {
                this.rows = [...this.rows, this.sortedlist[i]];
            }
        }
    }

    getRows() {
        if (!this.sortedlist) {
            return;
        }
        this.rows = [];
        if (this.pageSize < this.sortedlist.length) {
            for (let i = 0; i < this.pageSize; i++) {
                this.rows = [...this.rows, this.sortedlist[i]];
            }
        } else {
            for (let i = 0; i < this.sortedlist.length; i++) {
                this.rows = [...this.rows, this.sortedlist[i]];
            }
        }
        this.pageLength = this.sortedlist.length;
    }

    onConfirmDelete(user) {
        this.itemDelete = user;
        this.openModal();
    }

    openModal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: 'Xóa loại tư vấn',
            message: 'Bạn có muốn xóa ' + this.itemDelete.name + '?'
        };
        const dialogRef = this.dialog.open(DeletionConfirmModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {
                this.deleteType();
            }
        });
    }

    openDetail(row) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: row.id,
        };
        const dialogRef = this.dialog.open(UpdateTypeAdvisoryComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {
                this.getUserlist();
            }
        });
    }

    onCreateNewType() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {};
        const staffRegisterRef = this.dialog.open(CreateTypeAdvisoryComponent, dialogConfig);
        staffRegisterRef.afterClosed().subscribe(result => {
            if (result && result === 'ok') {
                this.getUserlist();
            }
        });
    }

    onSort(sort) {
        if (!sort) {
            this.model.sort.active = '';
            this.model.sort.direction = '';
            return;
        }
        if (!this.typeList) {
            return;
        }
        const data = this.typeList.slice();
        this.model.sort.active = sort.active;
        this.model.sort.direction = sort.direction;
        this.model.pageIndex = 0;
        if (!sort || !sort.active || sort.direction === '') {
            this.sortedlist = data;
            this.getRows();
            return;
        }
        this.sortedlist = data.sort((a, b) => {
            const isAsc = this.model.sort.direction === 'asc';
            switch (this.model.sort.active) {
                case 'name':
                    return compare(a.name, b.name, isAsc);
                case 'price':
                    return compare(a.price, b.price, isAsc);
                case 'limitNumberRecords':
                    return compare(a.limitNumberRecords, b.limitNumberRecords, isAsc);
                case 'description':
                    return compare(a.description, b.description, isAsc);
                case 'typeString':
                    return compare(a.typeString, b.typeString, isAsc);
                default:
                    return 0;
            }
        });
        this.getRows();
    }

    async getUserlist(): Promise<any> {
        try {
            this.spinner.show();
            const response = await this.typeAdvisoryServices.getListTypeAdvisories().toPromise();
            const listUser = response && response.typeAdvisories;
            this.typeList = [];
            if (listUser && listUser.length > 0) {
                this.typeList = listUser.map(obj => new TypeAdvisory(obj));
            }
            this.onSort(this.model.sort);
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async deleteType(): Promise<any> {
        try {
            this.spinner.show();
            const response = await this.typeAdvisoryServices.deleteType(this.itemDelete).toPromise();
            this.spinner.hide();
            const status = response && response.status;
            if (status) {
                this.commonService.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã xóa thành công ' + this.itemDelete.name}));
                this.getUserlist();
            }
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }
}

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
