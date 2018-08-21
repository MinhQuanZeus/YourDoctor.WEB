import {NgModule} from '@angular/core';
import {LoginComponent} from './component';
import {MatButtonModule, MatButtonToggleModule, MatCardModule, MatInputModule, MatToolbarModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

const routes: Routes = [
    {path: '', component: LoginComponent},
];
@NgModule({
    imports: [
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
        RouterModule.forChild(routes)
    ],
    declarations: [
        LoginComponent,
    ],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})
export class LoginModule {
}
