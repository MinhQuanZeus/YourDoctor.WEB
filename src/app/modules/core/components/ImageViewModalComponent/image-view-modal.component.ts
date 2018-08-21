import {Component, Inject, Injectable} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
    selector: 'app-dialog-image-view',
    templateUrl: 'image-view-modal.component.html'
})

export class ImageViewModalComponent {
    dataImage: any;
    constructor(private dialogRef: MatDialogRef<ImageViewModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dataImage = data;
    }

    public ok() {
        this.dialogRef.close('ok');
    }
}
