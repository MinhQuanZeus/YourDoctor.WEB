import {Specialist} from './Specialist';

export class Doctor {
    constructor(private props: any = {
        doctorId: null,
        systemRating: null,
        universityGraduate: null,
        yearGraduate: null,
        placeWorking: null,
        currentRating: null,
        certificates: null,
        idSpecialist: null,
    }) {
    }

    get certificates(): Certificate[] {
        if (this.props.certificates && this.props.certificates.length > 0) {
            return this.props.certificates.map(obj => new Certificate(obj));
        } else {
            return [];
        }
    }

    get specialists(): Specialist[] {
        if (this.props.idSpecialist && this.props.idSpecialist.length > 0) {
            return this.props.idSpecialist.map(obj => new Specialist(obj));
        } else {
            return [];
        }
    }

    get doctorId(): any {
        return this.props.doctorId;
    }

    get systemRating(): any {
        return this.props.systemRating;
    }

    get universityGraduate(): any {
        return this.props.universityGraduate;
    }

    get yearGraduate(): any {
        return this.props.yearGraduate;
    }

    get placeWorking(): any {
        return this.props.placeWorking;
    }

    get currentRating(): any {
        return this.props.currentRating;
    }
}

export class Certificate {
    constructor(private props: any = {
        _id: null,
        name: null,
        pathImage: null
    }) {
    }

    get image(): string {
        return this.props.pathImage;
    }

    get name(): string {
        return this.props.name;
    }
}
