export class Specialist {
    constructor(private props: any = {
        _id: null,
        createdAt: null,
        updatedAt: null,
        specialistId: null,
        listQuestion: null,
        name: null,
        description: null,
        image: null
    }) {
    }

    get specialistId(): string {
        return this.props.specialistId;
    }

    get name(): string {
        return this.props.name;
    }

    get id(): string {
        return this.props._id;
    }

    get description(): string {
        return this.props.description;
    }

    get image(): string {
        return this.props.image;
    }

    get updatedAt(): number {
        return this.props.updatedAt;
    }

    get listQuestion(): string[] {
        return this.props.listQuestion;
    }

    get listQuestionString(): string {
        if (this.props.listQuestion && this.props.listQuestion.length > 0) {
            let data = '';
            for (const str of this.props.listQuestion) {
                data = data + str + '\n';
            }
            return data;
        }
    }
}
