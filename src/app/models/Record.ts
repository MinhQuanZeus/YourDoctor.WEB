import * as moment from 'moment';

export class Record {
    constructor(private props: any = {
        createdAt: null,
        recorderID: null,
        type: null,
        value: null
    }) {
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
    get recorderId(): string {
        return this.props.recorderID;
    }
    get type(): number {
        return this.props.type;
    }
    get value(): string {
        return this.props.value;
    }
}
