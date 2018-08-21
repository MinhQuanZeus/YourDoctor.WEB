import * as moment from 'moment';
export class PaymentHistory {
    constructor(private props: any = {
        createdAt: null,
        updatedAt: null,
        _id: null,
        userID: null,
        amount: null,
        remainMoney: null,
        fromUser: null,
        typeAdvisoryID: null,
        status: null
    }) {}

    get createdAt(): number {
        return this.props.createdAt;
    }
    get createdAtFormatted(): string {
        if (!this.props.createdAt) {
            return '';
        }
        return moment(this.props.createdAt).format('YYYY/MM/DD hh:mm');
    }
    get updatedAt(): number {
        return this.props.updatedAt;
    }
    get id(): string {
        return this.props._id;
    }
    get userID(): string {
        return this.props.userID;
    }
    get amount(): number {
        if (!this.props.amount) {
            return 0;
        }
        return this.props.amount.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    }
    get remainMoney(): number {
        if (!this.props.remainMoney) {
            return 0;
        }
        return this.props.remainMoney.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
    }
    get fromUser(): FromUserInfo {
        return new FromUserInfo(this.props.fromUser);
    }

    get formUserFullName(): string {
        return this.fromUser.fullName;
    }

    get typeAdvisory(): string {
        return this.props.typeAdvisoryID ? this.props.typeAdvisoryID.name : '';
    }

}

class FromUserInfo {
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
