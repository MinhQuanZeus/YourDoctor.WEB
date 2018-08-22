import {NgModule} from '@angular/core';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatGridListModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
    BankingHistoriesComponent,
    ChatHistoriesComponent,
    PaymentHistoriesComponent,
    UserDetailComponent,
    VideoCallHistoriesComponent
} from './components';

@NgModule({
    imports: [
        RouterModule,
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        TranslateModule,
        MatTabsModule,
        MatSelectModule,
        MatGridListModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatChipsModule,
        MatTooltipModule,
        MatDatepickerModule,
    ],
    declarations: [
        UserDetailComponent,
        ChatHistoriesComponent,
        VideoCallHistoriesComponent,
        PaymentHistoriesComponent,
        BankingHistoriesComponent
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [
        UserDetailComponent
    ],
    providers: []
})
export class UserDetailModule {
}
