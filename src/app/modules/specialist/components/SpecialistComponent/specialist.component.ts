import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatPaginator} from '@angular/material';
import {CommonServices, SpecialistServices} from '../../../../services/';
import {Message, Specialist} from '../../../../models';
import {DeletionConfirmModalComponent} from '../../../core/components';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {CreateSpecialistComponent} from '../CreateSpecialistComponent/create-specialist.component';
import {UpdateSpecialistComponent} from '../UpdateSpecialistComponent/update-specialist.component';

@Component({
    selector: 'app-specialist',
    templateUrl: 'specialist.component.html',
    styleUrls: ['specialist.component.scss']
})
export class SpecialistComponent implements OnInit {

    rows: Specialist[];

    @ViewChild(MatPaginator) paginator1: MatPaginator;
    @ViewChild('keyWord') keyWord: ElementRef;
    pageLength = 0;
    pageSize = 15;
    model: any;
    specialistList: Specialist[];
    itemDelete: Specialist;
    sortedlist: Specialist[];
    status = false;
    header = [
        {
            name: 'Tên',
            key: 'name',
            order: 'asc'
        },
        {
            name: 'Mô tả',
            key: 'description',
            order: 'asc'
        }
    ];

    constructor(private specialistServices: SpecialistServices, private dialog: MatDialog, private commonService: CommonServices) {
        this.model = {
            sort: {
                active: 'name',
                direction: 'asc'
            },
            status: 3,
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
        const dialogRef = this.dialog.open(UpdateSpecialistComponent, dialogConfig);
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
        const staffRegisterRef = this.dialog.open(CreateSpecialistComponent, dialogConfig);
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
        if (!this.specialistList) {
            return;
        }
        const data = this.specialistList.slice();
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
                case 'description':
                    return compare(a.description, b.description, isAsc);
                default:
                    return 0;
            }
        });
        this.getRows();
    }

    async getUserlist(): Promise<any> {
        try {
            const response = await this.specialistServices.getList().toPromise();
            const listUser = response && response.listSpecialist;
            this.specialistList = [];
            if (listUser && listUser.length > 0) {
                this.specialistList = listUser.map(obj => new Specialist(obj));
            }
            this.onSort(this.model.sort);
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async deleteType(): Promise<any> {
        try {
            const response = await this.specialistServices.delete(this.itemDelete).toPromise();
            const status = response && response.status;
            if (status) {
                this.commonService.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã xóa thành công ' + this.itemDelete.name}));
                this.getUserlist();
            }
        } catch (e) {
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
