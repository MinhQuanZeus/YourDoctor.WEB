import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Banking, User} from '../../../../models';
import {MatDatepicker, MatDatepickerInputEvent, MatDialog, MatDialogConfig} from '@angular/material';
import * as moment from 'moment';
import {ImageViewModalComponent} from '../../../core/components';

@Component({
    selector: 'app-banking-histories',
    templateUrl: 'banking-histories.component.html',
    styleUrls: ['banking-histories.component.scss']
})

export class BankingHistoriesComponent implements OnChanges {

    @ViewChild('startDate') startDatepicker: MatDatepicker<Date>;
    @ViewChild('endDate') endDatepicker: MatDatepicker<Date>;

    headers = [
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
            name: 'Ngân hàng',
            key: 'nameBank',
            order: 'asc'
        },
        {
            name: 'Số tài khoản',
            key: 'accountNumber',
            order: 'asc'
        },
        {
            name: 'Trạng thái',
            key: 'statusString',
            order: 'asc'
        },
        {
            name: 'Chú thích',
            key: 'comment',
            order: 'asc'
        }
    ];

    @Input() userInfo = new User();
    @Input() bankingHistories: Banking[];
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

    constructor(private dialog: MatDialog) {
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
        if (!this.bankingHistories || this.bankingHistories.length === 0) {
            return;
        }
        this.model.keyword = this.model.keyword ? this.model.keyword.trim() : '';
        this.searchedList = this.bankingHistories.filter(obj =>
            (obj.comment.toLowerCase().includes(this.model.keyword.toLowerCase())));
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

    onChangeStatus(value) {
        this.model.status = value;
        this.onSearch();
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
                case 'createdAtFormatted':
                    return compare(a.createdAtFormatted, b.createdAtFormatted, isAsc);
                case 'amount':
                    return compare(a.amount, b.amount, isAsc);
                case 'nameBank':
                    return compare(a.nameBank, b.nameBank, isAsc);
                case 'accountNumber':
                    return compare(a.accountNumber, b.accountNumber, isAsc);
                case 'statusString':
                    return compare(a.statusString, b.statusString, isAsc);
                case 'comment':
                    return compare(a.comment, b.comment, isAsc);
                default:
                    return 0;
            }
        });
        this.getPages();
    }

    public previewImage(data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            image: data.invoice
        };
        const dialogRef = this.dialog.open(ImageViewModalComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.bankingHistories && this.bankingHistories.length > 0) {
            this.searchedList = this.bankingHistories;
            this.onSort(this.model.sort);
            this.getPages();
        }
    }

}

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
