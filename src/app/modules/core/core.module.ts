import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    SidemenuComponent,
    ToolbarComponent,
    SearchBarComponent,
    FullscreenComponent,
    SidebarComponent,
    UserMenuComponent,
    ToolbarNotificationComponent,
    SidemenuItemComponent,
    DeletionConfirmModalComponent,
    FlashMessageComponent,
    FlashMessageContainerComponent,
    ImageViewModalComponent
} from './components';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MatTabsModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
    MatSidenavModule,
    MatSliderModule,
    MatProgressBarModule,
} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({

    declarations: [
        SidemenuComponent,
        SidemenuItemComponent,
        ToolbarNotificationComponent,
        ToolbarComponent,
        SearchBarComponent,
        FullscreenComponent,
        SidebarComponent,
        UserMenuComponent,
        DeletionConfirmModalComponent,
        FlashMessageComponent,
        FlashMessageContainerComponent,
        ImageViewModalComponent
    ],

    imports: [
        CommonModule,
        MatListModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatChipsModule,
        RouterModule,
        TranslateModule,

        PerfectScrollbarModule,
        FlexLayoutModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatTabsModule,
        MatSliderModule,
        MatDialogModule,
        MatProgressBarModule,
    ],


    exports: [
        SidemenuComponent,
        SidemenuItemComponent,
        ToolbarNotificationComponent,
        ToolbarComponent,
        SearchBarComponent,
        FullscreenComponent,
        SidebarComponent,
        UserMenuComponent,
        FlashMessageComponent,
        FlashMessageContainerComponent
    ],
    entryComponents: [DeletionConfirmModalComponent, ImageViewModalComponent],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ]
})
export class CoreModule {
}
