import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '../../../../../../node_modules/@angular/common/http';
import {Message, Specialist, TypeAdvisory} from '../../../../models';
import {CommonServices, SpecialistServices} from '../../../../services';

@Component({
    selector: 'app-update-type-advisory',
    templateUrl: 'update-specialist.component.html',
    styleUrls: ['update-specialist.component.scss']
})

export class UpdateSpecialistComponent {
    userForm: FormGroup;
    model = {
        id: null,
        image: null,
        name: null,
        description: null,
        listQuestion: null,
    };

    avatar: File;
    avatarSrc = '../../../../../assets/images/noavatar.png';

    constructor(private dialogRef: MatDialogRef<UpdateSpecialistComponent>,
                private specialistServices: SpecialistServices, private commonService: CommonServices,
                @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
        this.getSpecialist(data.id);
        this.userForm = this.fb.group({
            'specialistName': ['', [
                Validators.maxLength(100),
                Validators.required
            ],
            ],
            'listQuestion': ['', [],
            ],
            'description': ['', [
                Validators.maxLength(4000)
            ]
            ]
        });
    }

    public ok() {
        this.dialogRef.close('ok');
    }

    public cancel() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.model.name = this.model.name ? this.model.name.trim() : '';
        this.model.description = this.model.description ? this.model.description.trim() : '';
        this.model.listQuestion = this.model.listQuestion ? this.model.listQuestion.trim() : '';
        if (this.userForm.valid) {
            const arrayQuestion = [];
            if (this.model.listQuestion) {
                const strArray: string[] = this.model.listQuestion.split('\n');
                if (strArray && strArray.length > 0) {
                    for (let i = 0; i < strArray.length; i++) {
                        const temp = strArray[i] ? strArray[i].trim() : '';
                        if (temp && temp.length > 0) {
                            arrayQuestion.push(temp);
                        }
                    }
                }
            }
            const data = {
                id: this.model.id,
                name: this.model.name,
                description: this.model.description,
                listQuestion: arrayQuestion
            };
            const formData = new FormData();
            if (this.avatar) {
                formData.append('image', this.avatar);
            }
            formData.append('specialist', JSON.stringify(data));
            this.postType(formData);
        }
    }

    onImageChange(event) {
        this.avatar = event && event.target && event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
        if (this.avatar) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.avatarSrc = (<FileReader>e.target).result;
            };
            reader.readAsDataURL(this.avatar);
        }
    }

    async postType(data): Promise<any> {
        try {
            const response = await this.specialistServices.edit(this.model.id, data).toPromise();
            if (response) {
                this.dialogRef.close('ok');
                this.commonService.showFlashMessage(
                    new Message({id: new Date().getTime(), type: 'SUCCESS', content: 'Đã sửa thành công ' + this.model.name}));
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

    async getSpecialist(id) {
        try {
            const res = await this.specialistServices.getById(id).toPromise();
            const userRes = res && res.objSpecialist ? res.objSpecialist : null;
            if (userRes) {
                const data = new Specialist(userRes);
                this.model.id = data.id;
                this.model.name = data.name;
                this.model.description = data.description;
                this.model.listQuestion = data.listQuestionString;
                this.avatarSrc = data.image;
                this.model.image = data.image;
            }
        } catch (e) {
            if (e instanceof HttpErrorResponse) {
                const error = e && e.error && e.error.error ? e.error.error : '';
                this.commonService.showFlashMessage(new Message({id: new Date().getTime(), type: 'ERROR', content: error}));
            }
        }
    }

}
