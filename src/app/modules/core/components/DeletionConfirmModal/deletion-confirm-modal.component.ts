import {Component, Inject, Injectable} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';

@Component({
    selector: 'app-dialog-confirm-delete',
    templateUrl: 'deletion-confirm-modal.component.html'
})

export class DeletionConfirmModalComponent {

    constructor(private dialogRef: MatDialogRef<DeletionConfirmModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        console.log(data);
    }

    public ok() {
        this.dialogRef.close('ok');
    }
    public cancel() {
        this.dialogRef.close();
    }

}
