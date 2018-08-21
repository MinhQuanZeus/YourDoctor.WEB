import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';
import {HttpParams} from '../../../node_modules/@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SpecialistServices {
    constructor(private http: HttpClient) {
    }

    getList(): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'specialists/get-all-specialist');
    }

    delete(params): Observable<any> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('updateTime', params.updatedAt);
        return this.http.delete(environment.API_ENDPOINT + 'specialists/' + params.id, {params: httpParams});
    }

    create(data): Observable<any> {
        return this.http.post(environment.API_ENDPOINT + 'specialists/', data);
    }

    edit(id, data): Observable<any> {
        return this.http.put(environment.API_ENDPOINT + 'specialists/' + id, data);
    }

    getById(id): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'specialists/getDetailSpecialist/' + id);
    }
}
