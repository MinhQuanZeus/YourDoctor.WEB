import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';

@Injectable({
    providedIn: 'root',
})
export class VideoCallServices {
    constructor(private http: HttpClient) {
    }

    getPattientVideoCallHistories(patientId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'videcallhistories/getHistoryVideoCallPatient/' + patientId);
    }

    getDoctorVideoCallHistories(doctorId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'videcallhistories/getHistoryVideoCallDoctor/' + doctorId);
    }
}
