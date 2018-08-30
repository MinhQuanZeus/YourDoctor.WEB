import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';

@Injectable({
    providedIn: 'root',
})
export class ReportServices {
    constructor(private http: HttpClient) {
    }

    getReports(): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'reportConversations/get-list-report-conversation/');
    }

    getById(id): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'reportConversations/' + id);
    }

    updateReport(body): Observable<any> {
        return this.http.put(environment.API_ENDPOINT + '/reportConversations/reportPunish', body);
    }
}
