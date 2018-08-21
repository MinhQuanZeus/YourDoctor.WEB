import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';

@Injectable({
    providedIn: 'root',
})
export class PaymentServices {
    constructor(private http: HttpClient) {
    }

    getPaymentHistoriesByUserId(userId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'paymentshistorys/getPaymentHistoryByUser/' + userId);
    }
}
