import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import 'rxjs-compat/add/operator/retry';

@Injectable({
    providedIn: 'root',
})
export class ChatServices {
    constructor(private http: HttpClient) {
    }

    getPattientChatHistories(patientId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'chatshistorys/getAllConversationByPatient/' + patientId);
    }

    getDoctorChatHistories(doctorId): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'chatshistorys/getAllConversationByDoctor/' + doctorId);
    }

    register(formData): Observable<any> {
        // const headers = new HttpHeaders({
        //     'Content-Type': null,
        // });
        return this.http.post(environment.API_ENDPOINT + 'auth/register', formData);
    }

    getChatTopicById(id): Observable<any> {
        return this.http.get(environment.API_ENDPOINT + 'chatshistorys/getConversationByID/' + id);
    }
}
