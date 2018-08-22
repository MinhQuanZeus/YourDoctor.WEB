import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Message, Report, User} from '../../../../models';
import {MatDatepicker, MatDatepickerInputEvent, MatDialog, MatDialogConfig} from '@angular/material';
import * as moment from 'moment';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {CommonServices, ReportServices, UserServices} from '../../../../services';
import {UserDetailComponent} from '../../../user-detail/components';
import {ReportDetailComponent} from '../ReportDetailComponent/report-detail.component';

@Component({
    selector: 'app-payment-histories',
    templateUrl: 'report-list.component.html',
    styleUrls: ['report-list.component.scss']
})

export class ReportListComponent implements OnChanges {

    @ViewChild('startDate') startDatepicker: MatDatepicker<Date>;
    @ViewChild('endDate') endDatepicker: MatDatepicker<Date>;

    headers = [
        {
            name: 'Người tạo',
            key: 'fullNameReporter',
            order: 'asc'
        },
        {
            name: 'Người bị report',
            key: 'fullNamePersonBeingReported',
            order: 'asc'
        },
        {
            name: 'Ngày tạo',
            key: 'createdAtFormatted',
            order: 'asc'
        },
        {
            name: 'Lý do',
            key: 'reason',
            order: 'asc'
        },
        {
            name: 'Loại tư vấn',
            key: 'typeString',
            order: 'asc'
        },
        {
            name: 'Trạng thái',
            key: 'statusString',
            order: 'asc'
        }
    ];

    reportList: Report[];
    @ViewChild('keyWord') keyWordRef: ElementRef;
    model = {
        keyword: '',
        startTime: null,
        endTime: null,
        sort: {
            active: 'createdAtFormatted',
            direction: 'desc'
        },
        status: 'all',
        pageIndex: 0
    };
    historyItems: Report[];
    pageSize = 10;
    pageLength = 0;
    searchedList: Report[];
    sortedlist: Report[];
    startDatetime: any;
    endDatetime: any;

    keywordPlaceHolder: string;

    constructor(private reportServices: ReportServices, private commonServices: CommonServices, private dialog: MatDialog) {
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
        if (!this.reportList || this.reportList.length === 0) {
            return;
        }
        this.model.keyword = this.model.keyword ? this.model.keyword.trim() : '';
        this.searchedList = this.reportList.filter(obj =>
            (obj.fullNameReporter.toLowerCase().includes(this.model.keyword.toLowerCase())
                || obj.fullNamePersonBeingReported.toLowerCase().includes(this.model.keyword.toLowerCase())));
        if (this.model.startTime) {
            this.searchedList = this.searchedList.filter(obj => obj.createdAtFormatted >= this.model.startTime);
        }
        if (this.model.endTime) {
            this.searchedList = this.searchedList.filter(obj => obj.createdAtFormatted <= this.model.endTime);
        }
        if (this.model.status !== 'all') {
            this.searchedList = this.searchedList.filter(obj => obj.statusString === this.model.status);
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
        const dialogRef = this.dialog.open(ReportDetailComponent, dialogConfig);
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
                case 'fullNameReporter':
                    return compare(a.fullNameReporter, b.fullNameReporter, isAsc);
                case 'fullNamePersonBeingReported':
                    return compare(a.fullNamePersonBeingReported, b.fullNamePersonBeingReported, isAsc);
                case 'createdAtFormatted':
                    return compare(a.createdAtFormatted, b.createdAtFormatted, isAsc);
                case 'reason':
                    return compare(a.reason, b.reason, isAsc);
                case 'typeString':
                    return compare(a.typeString, b.typeString, isAsc);
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
            const response = await this.reportServices.getReports().toPromise();
            const data = response && response.listReport;
            this.reportList = [];
            if (data && data.length > 0) {
                this.reportList = data.map(obj => new Report(obj));
            }
            this.searchedList = this.reportList.slice();
            console.log(this.reportList);
            this.onSort(this.model.sort);
            this.getPages();
        } catch (e) {
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
