import {
    FEMALE,
    MALE, ROLE_ADMIN,
    ROLE_DOCTOR,
    ROLE_PATIENT, ROLE_SUPER_ADMIN,
    STATUS_DOCTOR_BLOCK,
    STATUS_DOCTOR_PENDING,
    STATUS_USER_BLOCK
} from '../constants';
import {Doctor} from './Doctor';

export class User {
    constructor(private props: any = {
        deletionFlag: null,
        _id: null,
        firstName: null,
        middleName: null,
        lastName: null,
        phoneNumber: null,
        remainMoney: null,
        gender: null,
        avatar: null,
        birthday: null,
        address: null,
        password: null,
        role: null,
        status: null,
        createdAt: null,
        updatedAt: null,
        reportCount: null,
        moreDoctorDetail: null
    }) {
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

    get doctorDetail(): Doctor {
        return new Doctor(this.props.moreDoctorDetail);
    }

    set doctorDetail(value: Doctor) {
        this.props.moreDoctorDetail = value;
    }

    get phoneNumber(): string {
        return this.props.phoneNumber;
    }

    get status(): number {
        return this.props.status;
    }

    get statusString(): string {
        switch (this.props.status) {
            case STATUS_USER_BLOCK:
                return 'Block';
            case STATUS_DOCTOR_BLOCK:
                return 'Bác sĩ block';
            case STATUS_DOCTOR_PENDING:
                return 'Bác sĩ chờ phê duyệt';
            default:
                return 'active';
        }
    }

    get role(): number {
        return this.props.role;
    }

    get roleString(): string {
        switch (this.props.role) {
            case ROLE_DOCTOR:
                return 'Bác sĩ';
            case ROLE_PATIENT:
                return 'Bệnh nhân';
            case ROLE_ADMIN:
                return 'Admin';
            case ROLE_SUPER_ADMIN:
                return 'Super admin';
        }
    }

    get gender(): number {
        return this.props.gender;
    }

    get genderString(): string {
        if (this.props.gender === MALE) {
            return 'nam';
        } else if (this.props.gender === FEMALE) {
            return 'nữ';
        } else {
            return 'khác';
        }
    }

    get address(): string {
        return this.props.address;
    }

    get birthday(): string {
        return this.props.birthday;
    }

    get updatedAt(): number {
        return this.props.updatedAt;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get middleName(): string {
        return this.props.middleName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get avatar(): string {
        return this.props.avatar;
    }

    get remainMoney(): number {
        if (!this.props.remainMoney) {
            return 0;
        }
        return this.props.remainMoney.toLocaleString('it-IT', {style: 'currency', currency: 'VND'});
    }

    get remainMoneyFormatted(): string {
        return format_number(this.props.remainMoney);
    }

    get id(): string {
        return this.props._id;
    }

    get reportCount(): number {
        return this.props.reportCount;
    }
}

function format_number(val) {
    const v = Number(val = '');
    if (isNaN(v)) {
        return val;
    }
    const sign = (v < 0) ? '-' : '';
    const res = Math.abs(v).toString().split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('');
    return sign + res;
}
