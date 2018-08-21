import * as moment from 'moment';

export class VideoCallHistory {
    constructor(private props: any = {
        _id: null,
        createdAt: null,
        updatedAt: null,
        doctorId: null,
        patientId: null,
        records: null,
        status: null,
        timeStart: null,
        timeEnd: null,
        linkVideo: null
    }) {
    }

    get id(): string {
        return this.props._id;
    }

    get content(): string {
        return this.props.contentTopic;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get createdAtFormatted(): string {
        if (!this.props.createdAt) {
            return '';
        }
        return moment(this.props.createdAt).format('YYYY/MM/DD hh:mm');
    }

    get timeStart(): number {
        return this.props.timeStart;
    }

    get timeStartFormatted(): string {
        if (!this.props.timeStart) {
            return '';
        }
        return moment(this.props.timeStart).format('YYYY/MM/DD hh:mm');
    }

    get callLength(): string {
        if (!this.props.timeEnd || !this.props.timeStart || (this.props.timeEnd - this.props.timeStart) < 0) {
            return '0';
        }
        const callength = (this.props.timeEnd - this.props.timeStart) / 1000;
        let length = '';
        const min = parseInt(callength / 60 + '', 10);
        const sec = parseInt(callength % 60 + '', 10);
        if (min < 10) {
            length = '0' + min + 'min';
        } else {
            length = min + 'min';
        }
        if (sec < 0) {
            length = length + '0' + sec + 'sec';
        } else {
            length = length + sec + 'sec';
        }
        return length;
    }

    get linkVideo(): string {
        return this.props.linkVideo;
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    get doctorDetail(): DoctorInfo {
        return new DoctorInfo(this.props.doctorId);
    }

    get patientDetail(): PatientInfo {
        return new PatientInfo(this.props.patientId);
    }

    get fullNamePatient(): string {
        return this.patientDetail.fullName;
    }

    get fullNameDoctor(): string {
        return this.doctorDetail.fullName;
    }

    get status(): number {
        return this.props.status;
    }

    get statusString(): string {
        if (this.status === 2) {
            return 'Hoàn thành';
        } else {
            return 'Chưa hoàn thành';
        }
    }
}

class DoctorInfo {
    constructor(private props: any = {
        _id: null,
        firstName: null,
        lastName: null,
        middleName: null,
    }) {
    }

    get id(): string {
        return this.props._id;
    }

    get fullName(): string {
        if (!this.props.firstName || !this.props.lastName) {
            return '';
        }
        if (!this.props.middleName) {
            return this.props.firstName + ' ' + this.props.lastName;
        } else {
            return this.props.firstName + ' ' + this.props.middleName + ' ' + this.props.lastName;
        }
    }
}

class PatientInfo {
    constructor(private props: any = {
        _id: null,
        firstName: null,
        lastName: null,
        middleName: null,
    }) {
    }

    get id(): string {
        return this.props._id;
    }

    get fullName(): string {
        if (!this.props.firstName || !this.props.lastName) {
            return '';
        }
        if (!this.props.middleName) {
            return this.props.firstName + ' ' + this.props.lastName;
        } else {
            return this.props.firstName + ' ' + this.props.middleName + ' ' + this.props.lastName;
        }
    }
}
