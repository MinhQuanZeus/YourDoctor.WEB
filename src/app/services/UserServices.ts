import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserServices {
    private subject = new Subject<any>();
    constructor(private http: HttpClient) {
    }

    getUsers(params): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        let httpParams = new HttpParams();
        httpParams = params.search_keyword ? httpParams.set('search_keyword', params.search_keyword) : httpParams;
        httpParams = httpParams.set('status', params.status);
        httpParams = httpParams.set('role', params.role);
        httpParams = params.sort_key ? httpParams.set('sort_key', params.sort_key) : httpParams;
        httpParams = params.sort_direction ? httpParams.set('sort_direction', params.sort_direction) : httpParams;
        return this.http.get(environment.API_ENDPOINT + 'users/get-all-user', {params: httpParams});
    }
    getUserInfo(): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'users');
    }

    updateUserInfo(message: string) {
        this.subject.next({ text: message });
    }

    getMessageUpdateUserInfo(): Observable<any> {
        return this.subject.asObservable();
    }

    deleteUser(params): Observable<any> {
        let httpParams = new HttpParams();
        httpParams = httpParams.set('updateTime', params.updatedAt);
        return this.http.delete(environment.API_ENDPOINT + 'users/' + params.id, {params: httpParams});
    }

    getUserById(userId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'users/detail/' + userId);
    }

    getDoctorDetail(doctorId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'doctors/getDetailDoctor/' + doctorId);
    }

    updateUser(body): Observable<any> {
        return this.http.put(environment.API_ENDPOINT + '/users/update-user', body);
    }
}
