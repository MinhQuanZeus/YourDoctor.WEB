import {NgModule} from '@angular/core';
import {LoginComponent} from './component';
import {MatButtonModule, MatButtonToggleModule, MatCardModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LoginRouter} from './login.router';


@NgModule({
    imports: [
        LoginRouter,
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
    declarations: [
        LoginComponent,
    ],
    providers: [

    ]
})
export class LoginModule {
}
