import * as moment from 'moment';
export class ChatHistory {
    constructor(private props: any = {
        _id: null,
        createdAt: null,
        updatedAt: null,
        contentTopic: null,
        doctorId: null,
        patientId: null,
        records: null,
        status: null
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

    get statusString (): string {
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
