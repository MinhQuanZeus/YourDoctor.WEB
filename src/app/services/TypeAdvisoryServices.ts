import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';
import {HttpParams} from '../../../node_modules/@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class TypeAdvisoryServices {
    constructor(private http: HttpClient) {
    }

    getListTypeAdvisories(): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'typeadvisorys/getAllTypeAdvisories/');
    }

    deleteType(params): Observable<any> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('updateTime', params.updatedAt);
        return this.http.delete(environment.API_ENDPOINT + 'typeadvisorys/' + params.id, {params: httpParams});
    }

    createNewType(data): Observable<any> {
        return this.http.post(environment.API_ENDPOINT + 'typeadvisorys/', data);
    }

    editNewType(data): Observable<any> {
        return this.http.put(environment.API_ENDPOINT + 'typeadvisorys/' + data.id, data);
    }

    getById(id): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + '/typeadvisorys/getTypeAdvisoriesById/' + id);
    }
}
