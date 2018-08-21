export class Message {
    public static SUCCESS = 'SUCCESS';
    public static INFO = 'INFO';
    public static WARNING = 'WARNING';
    public static ERROR = 'ERROR';

    constructor(private props: any = {
        id: null,
        type: null,
        content: null,
    }) { }

    get id(): any { return this.props.id; }
    get type(): string { return this.props.type; }
    get content(): string { return this.props.content; }
    get alert(): string {
        switch (this.props.type) {
            case Message.SUCCESS:
                return 'alert alert-success';
            case Message.INFO:
                return 'alert alert-info';
            case Message.WARNING:
                return 'alert alert-warning';
            case Message.ERROR:
                return 'alert alert-danger';
            default:
                return '';
        }
    }
}
