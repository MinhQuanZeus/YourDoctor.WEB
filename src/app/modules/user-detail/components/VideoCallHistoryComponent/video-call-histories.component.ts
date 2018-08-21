import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {User, VideoCallHistory} from '../../../../models';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material';
import * as moment from 'moment';

@Component({
    selector: 'app-video-call-histories',
    templateUrl: 'video-call-histories.component.html',
    styleUrls: ['video-call-histories.component.scss']
})

export class VideoCallHistoriesComponent implements OnChanges {

    @ViewChild('startDate') startDatepicker: MatDatepicker<Date>;
    @ViewChild('endDate') endDatepicker: MatDatepicker<Date>;
    headerDoctorChatHistories = [
        {
            name: 'Bệnh nhân',
            key: 'fullNamePatient',
            order: 'asc'
        },
        {
            name: 'Ngày gọi',
            key: 'timeStartFormatted',
            order: 'asc'
        },
        {
            name: 'Thời gian gọi',
            key: 'callLength',
            order: 'asc'
        },
        {
            name: 'Link video',
            key: 'linkVideo',
            order: 'asc'
        }
    ];

    headerPatientVideoCallHistories = [
        {
            name: 'Bác sĩ',
            key: 'fullNameDoctor',
            order: 'asc'
        },
        {
            name: 'Ngày gọi',
            key: 'timeStartFormatted',
            order: 'asc'
        },
        {
            name: 'Thời gian gọi',
            key: 'callLength',
            order: 'asc'
        },
        {
            name: 'Link video',
            key: 'linkVideo',
            order: 'asc'
        }
    ];

    @Input() userInfo = new User();
    @Input() videoCallHistories: VideoCallHistory[];
    @ViewChild('keyWord') keyWordRef: ElementRef;
    model = {
        keyword: '',
        startTime: null,
        endTime: null,
        sort: {
            active: 'timeStartFormatted',
            direction: 'desc'
        },
        status: 3,
        pageIndex: 0
    };
    historyItems: VideoCallHistory[];
    pageSize = 10;
    pageLength = 0;
    headers = [];
    searchedList: VideoCallHistory[];
    sortedlist: VideoCallHistory[];
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
                this.historyItems = [...this.historyItems, this.videoCallHistories[i]];
            }
        } else {
            for (let i = 1 * event.pageIndex * event.pageSize; i < event.pageSize + event.pageIndex * event.pageSize; i++) {
                this.historyItems = [...this.historyItems, this.videoCallHistories[i]];
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
        if (!this.videoCallHistories || this.videoCallHistories.length === 0) {
            return;
        }
        this.model.keyword = this.model.keyword ? this.model.keyword.trim() : '';
        this.searchedList = this.videoCallHistories.filter(obj =>
            (obj.fullNameDoctor.toLowerCase().includes(this.model.keyword.toLowerCase())
                || obj.fullNamePatient.toLowerCase().includes(this.model.keyword.toLowerCase())));
        if (this.model.startTime) {
            this.searchedList = this.searchedList.filter(obj => obj.timeStartFormatted >= this.model.startTime);
        }
        if (this.model.endTime) {
            this.searchedList = this.searchedList.filter(obj => obj.timeStartFormatted <= this.model.endTime);
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
                case 'fullNamePatient':
                    return compare(a.fullNamePatient, b.fullNamePatient, isAsc);
                case 'fullNameDoctor':
                    return compare(a.fullNameDoctor, b.fullNameDoctor, isAsc);
                case 'timeStartFormatted':
                    return compare(a.timeStartFormatted, b.timeStartFormatted, isAsc);
                case 'callLength':
                    return compare(a.callLength, b.callLength, isAsc);
                case 'linkVideo':
                    return compare(a.linkVideo, b.linkVideo, isAsc);
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
                this.headers = this.headerPatientVideoCallHistories;
            } else {
                this.keywordPlaceHolder = 'Tên bệnh nhân';
                this.headers = this.headerDoctorChatHistories;
            }
        }

        if (this.videoCallHistories && this.videoCallHistories.length > 0) {
            this.searchedList = this.videoCallHistories;
            this.onSort(this.model.sort);
            this.getPages();
        }
    }

}

function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
