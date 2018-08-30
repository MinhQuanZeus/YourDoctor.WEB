import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';

@Injectable({
    providedIn: 'root',
})
export class BankingServices {
    constructor(private http: HttpClient) {
    }

    getBankingHistoriesByUserId(userId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'bankinghistorys/getHistoryBanking/' + userId);
    }

    getAllBankingHistory(): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'bankinghistorys');
    }

    getById(id): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'bankinghistorys/get-detail-banking/' + id);
    }

    updateBank(body, id): Observable<any> {
        return this.http.put(environment.API_ENDPOINT + 'bankinghistorys/handleBankingHistory/' + id, body);
    }
}
