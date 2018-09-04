export class TypeAdvisory {
    constructor(private props: any = {
        createdAt: null,
        updatedAt: null,
        deletionFlag: null,
        _id: null,
        name: null,
        price: null,
        type: null,
        limitNumberRecords: null,
        description: null,
    }) {
    }

    get createdAt(): number {
        return this.props.createdAt;
    }

    get updatedAt(): number {
        return this.props.updatedAt;
    }

    get deletionFlag() {
        return this.props.deletionFlag;
    }

    get id() {
        return this.props._id;
    }

    get name() {
        return this.props.name;
    }

    get price() {
        if (!this.props.price) {
            return 0;
        }
        return this.props.price.toLocaleString('it-IT', {style: 'currency', currency: 'VND'});
    }

    get priceOrigin(): number {
        return this.props.price;
    }

    get type(): number {
        return this.props.type;
    }

    get typeString(): string {
        if (this.props.type === 1) {
            return 'chat';
        } else {
            return 'video call';
        }
    }

    get limitNumberRecords() {
        return this.props.limitNumberRecords;
    }

    get description() {
        return this.props.description;
    }
}
