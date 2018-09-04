import * as moment from 'moment';
import {Record} from './Record';
import {User} from './User';

export class Chat {
    constructor(private props: any = {
        createdAt: null,
        updatedAt: null,
        _id: null,
        contentTopic: null,
        patientId: null,
        doctorId: null,
        status: null,
        records: null
    }) {

    }

    get contentTopic(): string {
        return this.props.contentTopic;
    }

    get createdAt(): string {
        return this.props.createdAt;
    }

    get createdAtFormatted(): string {
        if (!this.props.createdAt) {
            return '';
        }
        return moment(this.props.createdAt).format('YYYY/MM/DD HH:mm');
    }

    get updatedAt(): string {
        return this.props.updatedAt;
    }

    get record(): Record[] {
        return this.props.records && this.props.records.length > 0 ? this.props.records.map(obj => new Record(obj)) : [];
    }

    get doctorInfo(): User {
        return new User(this.props.doctorId);
    }

    get patientInfo(): User {
        return new User(this.props.patientId);
    }

    get status(): number {
        return this.props.status;
    }

    get statusString(): string {
        if (this.props.status === 2) {
            return 'Đã hoàn thành';
        } else {
            return 'Chưa hoàn thành';
        }
    }
}
