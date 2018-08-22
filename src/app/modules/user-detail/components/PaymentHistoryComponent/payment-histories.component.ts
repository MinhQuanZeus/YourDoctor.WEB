import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {PaymentHistory, User} from '../../../../models';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material';
import * as moment from 'moment';

@Component({
    selector: 'app-payment-histories',
    templateUrl: 'payment-histories.component.html',
    styleUrls: ['payment-histories.component.scss']
})

export class PaymentHistoriesComponent implements OnChanges {

    @ViewChild('startDate') startDatepicker: MatDatepicker<Date>;
    @ViewChild('endDate') endDatepicker: MatDatepicker<Date>;
    headerDoctorChatHistories = [
        {
            name: 'Bệnh nhân',
            key: 'formUserFullName',
            order: 'asc'
        },
        {
            name: 'Ngày nhận',
            key: 'createdAtFormatted',
            order: 'asc'
        },
        {
            name: 'Số tiền nhận',
            key: 'amount',
            order: 'asc'
        },
        {
            name: 'Số dư',
            key: 'remainMoney',
            order: 'asc'
        },
        {
            name: 'Loại tư vấn',
            key: 'typeAdvisory',
            order: 'asc'
        }
    ];

    headerPatientChatHistories = [
        {
            name: 'Bác sĩ',
            key: 'formUserFullName',
            order: 'asc'
        },
        {
            name: 'Ngày trừ',
            key: 'createdAtFormatted',
            order: 'asc'
        },
        {
            name: 'Số tiền true',
            key: 'amount',
            order: 'asc'
        },
        {
            name: 'Số dư',
            key: 'remainMoney',
            order: 'asc'
        },
        {
            name: 'Loại tư vấn',
            key: 'typeAdvisory',
            order: 'asc'
        }
    ];

    @Input() userInfo = new User();
    @Input() paymentHistories: PaymentHistory[];
    @ViewChild('keyWord') keyWordRef: ElementRef;
    model = {
        keyword: '',
        startTime: null,
        endTime: null,
        sort: {
            active: 'createdAtFormatted',
            direction: 'desc'
        },
        status: 3,
        pageIndex: 0
    };
    historyItems: PaymentHistory[];
    pageSize = 10;
    pageLength = 0;
    headers = [];
    searchedList: PaymentHistory[];
    sortedlist: PaymentHistory[];
    startDatetime: any;
    endDatetime: any;

    keywordPlaceHolder: string;

    constructor() {
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
        if (!this.paymentHistories || this.paymentHistories.length === 0) {
            return;
        }
        this.model.keyword = this.model.keyword ? this.model.keyword.trim() : '';
        this.searchedList = this.paymentHistories.filter(obj =>
            (obj.formUserFullName.toLowerCase().includes(this.model.keyword.toLowerCase())
                || obj.formUserFullName.toLowerCase().includes(this.model.keyword.toLowerCase())));
        if (this.model.startTime) {
            this.searchedList = this.searchedList.filter(obj => obj.createdAtFormatted >= this.model.startTime);
        }
        if (this.model.endTime) {
            this.searchedList = this.searchedList.filter(obj => obj.createdAtFormatted <= this.model.endTime);
        }
        this.onSort(this.model.sort);
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
                case 'formUserFullName':
                    return compare(a.formUserFullName, b.formUserFullName, isAsc);
                case 'amount':
                    return compare(a.amount, b.amount, isAsc);
                case 'remainMoney':
                    return compare(a.remainMoney, b.remainMoney, isAsc);
                case 'typeAdvisory':
                    return compare(a.typeAdvisory, b.typeAdvisory, isAsc);
                case 'createdAtFormatted':
                    return compare(a.createdAtFormatted, b.createdAtFormatted, isAsc);
                default:
                    return 0;
            }
        });
        this.getPages();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.userInfo) {
            if (this.userInfo.role === 1) {
                this.keywordPlaceHolder = 'Tên bác sĩ';
                this.headers = this.headerPatientChatHistories;
            } else {
                this.keywordPlaceHolder = 'Tên bệnh nhân';
                this.headers = this.headerDoctorChatHistories;
            }
        }

        if (this.paymentHistories && this.paymentHistories.length > 0) {
            this.searchedList = this.paymentHistories;
            this.onSort(this.model.sort);
            this.getPages();
        }
    }

}

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
