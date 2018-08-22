import * as moment from 'moment';
import {User} from './User';

export class Banking {
    constructor(private props: any = {
        status: null,
        timeInputCode: null,
        createdAt: null,
        updatedAt: null,
        deletionFlag: null,
        _id: null,
        userId: null,
        amount: null,
        type: null,
        nameBank: null,
        accountNumber: null,
        comment: null,
        invoice: null
    }) {
    }

    get status(): number {
        return this.props.status;
    }

    get statusString(): string {
        switch (this.props.status) {
            case 1:
                return 'Chưa xác minh';
            case 2:
                return 'Chưa xử lý';
            case 3:
                return 'Đã chuyển';
            case 4:
                return 'Hủy bỏ';
            default:
                return 'Chưa xác minh';
        }
    }

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

    get userInfo(): User {
        return new User(this.props.userId);
    }

    get userFullname(): string {
        return this.userInfo.fullName;
    }

    get amount(): number {
        if (!this.props.amount) {
            return 0;
        }
        return this.props.amount.toLocaleString('it-IT', {style: 'currency', currency: 'VND'});
    }

    get nameBank(): string {
        return this.props.nameBank;
    }

    get accountNumber(): string {
        return this.props.accountNumber;
    }

    get comment(): string {
        return this.props.comment;
    }

    get invoice(): string {
        return this.props.invoice || '../../../../../assets/images/no-image-icon.png';
    }
}
