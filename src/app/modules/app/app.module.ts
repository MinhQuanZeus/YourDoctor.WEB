import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './components';
import {CoreModule, LazyLoadModule} from '../../modules';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '../../interceptors';
import {
    AuthServices,
    CommonServices,
    UserServices,
    ChatServices,
    VideoCallServices,
    PaymentServices,
    TypeAdvisoryServices, SpecialistServices, ReportServices, BankingServices
} from '../../services';
import {CookieService} from 'ngx-cookie-service';
import {HttpErrorInterceptor} from '../../interceptors/HttpErrorInterceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


@NgModule({
    declarations: [
        AppComponent,

    ],
    imports: [
        BrowserModule,
        CoreModule,
        LazyLoadModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        BrowserAnimationsModule,
    ],
    exports: [RouterModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        UserServices,
        AuthServices,
        CookieService,
        CommonServices,
        ChatServices,
        VideoCallServices,
        PaymentServices,
        TypeAdvisoryServices,
        SpecialistServices,
        ReportServices,
        BankingServices
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
