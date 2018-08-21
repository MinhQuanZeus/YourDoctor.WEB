import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';

@Injectable({
    providedIn: 'root',
})
export class AuthServices {
    constructor(private http: HttpClient) {
    }

    login(body): Observable<any> {
        return this.http.post(environment.API_ENDPOINT + 'auth/login', body).retry(0);
    }

    logOut(): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'auth/logout');
    }

    register(formData): Observable<any> {
        // const headers = new HttpHeaders({
        //     'Content-Type': null,
        // });
        return this.http.post(environment.API_ENDPOINT + 'auth/register', formData);
    }
}
