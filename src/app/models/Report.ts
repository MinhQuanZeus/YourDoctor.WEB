import * as moment from 'moment';
import {User} from './User';

export class Report {
    constructor(private props: any = {
        status: null,
        createdAt: null,
        updatedAt: null,
        _id: null,
        idReporter: null,
        idPersonBeingReported: null,
        reason: null,
        idConversation: null,
        type: null,
        punish: null,
    }) {
    }

    get status(): boolean {
        return this.props.status;
    }
    get punish(): number {
        return this.props.punish;
    }

    get statusString(): string {
        if (this.status) {
            return 'Đã xử lý';
        } else {
            return 'Chưa xử lý';
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

    get reason(): string {
        return this.props.reason;
    }

    get idConversation(): string {
        return this.props.idConversation;
    }

    get reporter(): User {
        return new User(this.props.idReporter);
    }

    get fullNameReporter(): string {
        return this.reporter.fullName;
    }

    get personBeingReported(): User {
        return new User(this.props.idPersonBeingReported);
    }

    get fullNamePersonBeingReported(): string {
        return this.personBeingReported.fullName;
    }

    get type(): number {
        return this.props.type;
    }

    get typeString(): string {
        if (this.props.type === 1) {
            return 'chat';
        } else if (this.props.type === 2) {
            return 'video call';
        } else {
            return '';
        }
    }
}
