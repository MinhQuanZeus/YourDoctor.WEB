import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTooltipModule
} from '@angular/material';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {MatTableModule} from '@angular/material/table';


import * as hljs from 'highlight.js';
import {HIGHLIGHT_JS, HighlightJsModule} from 'angular-highlight-js';
import * as hljsTypescript from 'highlight.js/lib/languages/typescript';
import {StaffRegisterComponent, UserListComponent} from './components';
import {MatDialogModule} from '@angular/material/dialog';
import {UserDetailModule} from '../user-detail/user-detail.module';
import {UserListRouter} from './user-list.router';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

export function highlightJsFactory(): any {
    hljs.registerLanguage('typescript', hljsTypescript);
    return hljs;
}

@NgModule({
    imports: [
        UserListRouter,
        UserDetailModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatToolbarModule,
        MatListModule,
        MatStepperModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatChipsModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatSelectModule,
        PerfectScrollbarModule,
        HighlightJsModule.forRoot({
            provide: HIGHLIGHT_JS,
            useFactory: highlightJsFactory
        }),
    ],
    declarations: [
        UserListComponent,
        StaffRegisterComponent
    ],
    entryComponents: [
        StaffRegisterComponent
    ],
providers: [
    {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
]
})
export class UserListModule {
}


