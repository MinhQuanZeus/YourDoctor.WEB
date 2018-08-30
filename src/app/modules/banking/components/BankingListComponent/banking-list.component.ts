import {Component, ElementRef, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Banking, Message} from '../../../../models';
import {MatDatepicker, MatDatepickerInputEvent, MatDialog, MatDialogConfig} from '@angular/material';
import * as moment from 'moment';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {BankingServices, CommonServices} from '../../../../services';
import {BankingDetailComponent} from '../BankingDetailComponent/banking-detail.component';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-payment-histories',
    templateUrl: 'banking-list.component.html',
    styleUrls: ['banking-list.component.scss']
})

export class BankingListComponent implements OnChanges {

    @ViewChild('startDate') startDatepicker: MatDatepicker<Date>;
    @ViewChild('endDate') endDatepicker: MatDatepicker<Date>;

    headers = [
        {
            name: 'Bác sĩ',
            key: 'userFullname',
            order: 'asc'
        },
        {
            name: 'Ngày tạo',
            key: 'createdAtFormatted',
            order: 'asc'
        },
        {
            name: 'Số tiền rút',
            key: 'amount',
            order: 'asc'
        },
        {
            name: 'Trạng thái',
            key: 'statusString',
            order: 'asc'
        }
    ];

    bankingList: Banking[];
    @ViewChild('keyWord') keyWordRef: ElementRef;
    model = {
        keyword: '',
        startTime: null,
        endTime: null,
        sort: {
            active: 'createdAtFormatted',
            direction: 'desc'
        },
        status: -1,
        pageIndex: 0
    };
    historyItems: Banking[];
    pageSize = 10;
    pageLength = 0;
    searchedList: Banking[];
    sortedlist: Banking[];
    startDatetime: any;
    endDatetime: any;

    keywordPlaceHolder: string;

    constructor(private bankingServices: BankingServices,
                private spinner: NgxSpinnerService,
                private commonServices: CommonServices, private dialog: MatDialog) {
        this.getUserlist();
    }

    nextPage(event) {
        this.historyItems = [];
        this.model.pageIndex = event.pageIndex;
        if ((event.pageIndex + 1) * event.pageSize > event.length) {
            for (let i = 1 * event.pageIndex * event.pageSize; i < event.length; i++) {
                this.historyItems = [...this.historyItems, this.sortedlist[i]];
            }
        } else {
            for (let i = 1 * event.pageIndex * event.pageSize; i < event.pageSize + event.pageIndex * event.pageSize; i++) {
                this.historyItems = [...this.historyItems, this.sortedlist[i]];
            }
        }
    }

    onChangeStatus(value) {
        this.model.status = value;
        this.onSearch();
    }

    getPages() {
        if (!this.sortedlist) {
            return;
        }
        this.historyItems = [];
        if (this.pageSize < this.sortedlist.length) {
            for (let i = 0; i < this.pageSize; i++) {
                this.historyItems = [...this.historyItems, this.sortedlist[i]];
            }
        } else {
            for (let i = 0; i < this.sortedlist.length; i++) {
                this.historyItems = [...this.historyItems, this.sortedlist[i]];
            }
        }
        this.pageLength = this.sortedlist.length;
    }

    openStartDate() {
        this.startDatepicker.open();
    }
    openEndDate() {
        this.endDatepicker.open();
    }

    onBlurKeyWord() {
        this.onSearch();
    }

    onEnterSearchKey() {
        this.keyWordRef.nativeElement.blur();
    }

    startDateChange(event: MatDatepickerInputEvent<Date>) {
        this.startDatetime = event.value;
        this.model.startTime = event.value ? moment(event.value).format('YYYY/MM/DD') + ' 00:00' : '';
        this.onSearch();
    }

    endDateChange(event: MatDatepickerInputEvent<Date>) {
        this.endDatetime = event.value;
        this.model.endTime = event.value ? moment(event.value).format('YYYY/MM/DD') + ' 24:60' : '';
        this.onSearch();
    }

    onSearch() {
        if (!this.bankingList || this.bankingList.length === 0) {
            return;
        }
        this.model.keyword = this.model.keyword ? this.model.keyword.trim() : '';
        this.searchedList = this.bankingList.filter(obj =>
            (obj.userFullname.toLowerCase().includes(this.model.keyword.toLowerCase())));
        if (this.model.startTime) {
            this.searchedList = this.searchedList.filter(obj => obj.createdAtFormatted >= this.model.startTime);
        }
        if (this.model.endTime) {
            this.searchedList = this.searchedList.filter(obj => obj.createdAtFormatted <= this.model.endTime);
        }
        if (this.model.status !== -1) {
            this.searchedList = this.searchedList.filter(obj => obj.status === this.model.status);
        }
        this.onSort(this.model.sort);
    }
    openDetail(row) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: row.id,
        };
        const dialogRef = this.dialog.open(BankingDetailComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
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
        if (!this.searchedList) {
            return;
        }
        const data = this.searchedList.slice();
        this.model.sort.active = sort.active;
        this.model.sort.direction = sort.direction;
        this.model.pageIndex = 0;
        if (!sort || !sort.active || sort.direction === '') {
            this.sortedlist = data;
            this.getPages();
            return;
        }
        this.sortedlist = data.sort((a, b) => {
            const isAsc = this.model.sort.direction === 'asc';
            switch (this.model.sort.active) {
                case 'userFullname':
                    return compare(a.userFullname, b.userFullname, isAsc);
                case 'createdAtFormatted':
                    return compare(a.createdAtFormatted, b.createdAtFormatted, isAsc);
                case 'amount':
                    return compare(a.amount, b.amount, isAsc);
                case 'statusString':
                    return compare(a.statusString, b.statusString, isAsc);
                default:
                    return 0;
            }
        });
        this.getPages();
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    async getUserlist(): Promise<any> {
        try {
            this.spinner.show();
            const response = await this.bankingServices.getAllBankingHistory().toPromise();
            this.spinner.hide();
            const data = response && response.listBanking;
            this.bankingList = [];
            if (data && data.length > 0) {
                this.bankingList = data.map(obj => new Banking(obj));
            }
            this.searchedList = this.bankingList.slice();
            this.onSort(this.model.sort);
            this.getPages();
        } catch (e) {
            this.spinner.hide();
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonServices.showFlashMessage(new Message({ id: new Date().getTime(), type: 'ERROR', content: error }));
            }
        }
    }

}

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
