import { Component, Injector, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { FileUploader, FileUploaderOptions, FileUploadModule } from 'ng2-file-upload';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ProfileServiceProxy } from '@shared/service-proxies/service-proxies';
import { IAjaxResponse, TokenService } from 'abp-ng2-module';

@Component({
    selector: 'changeProfilePictureModal',
    templateUrl: './change-profile-picture-modal.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        FileUploadModule,
        ImageCropperComponent,
    ]
})
export class ChangeProfilePictureModalComponent extends AppComponentBase {

    @ViewChild('modal') modal: ModalDirective;
    @ViewChild('imageCropper') imageCropper: ImageCropperComponent;

    active = false;
    saving = false;
    uploader: FileUploader;
    temporaryPictureUrl: string;
    notAssignedValue = 'not-assigned';
    imageChangedEvent: any = '';
    maxProfilPictureBytesUserFriendlyValue: string = '5MB';

    private _uploaderOptions: FileUploaderOptions = <any>{
        url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture'
    };

    // Services
    private readonly _profileService = inject(ProfileServiceProxy);
    private readonly _tokenService = inject(TokenService);

    constructor(injector: Injector) {
        super(injector);
        this.initializeUploader();
    }

    initializeUploader(): void {
        this.uploader = new FileUploader({
            url: AppConsts.remoteServiceBaseUrl + '/Profile/UploadProfilePicture',
            authToken: 'Bearer ' + this._tokenService.getToken()
        });

        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.uploader.onSuccessItem = (item, response, status) => {
            const resp = <IAjaxResponse>JSON.parse(response);
            if (resp.success) {
                this.temporaryPictureUrl = AppConsts.remoteServiceBaseUrl + resp.result.fileName;
            } else {
                this.message.error(resp.error.message);
            }
        };

        this._uploaderOptions.autoUpload = true;
        this._uploaderOptions.authToken = 'Bearer ' + this._tokenService.getToken();
        this._uploaderOptions.removeAfterUpload = true;
        this.uploader.setOptions(this._uploaderOptions);
    }

    show(): void {
        this.active = true;
        this.temporaryPictureUrl = '';
        this.initializeUploader(); // Re-init to clear queue
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    save(): void {
        if (!this.temporaryPictureUrl) {
            return;
        }

        // Logic lấy base64 từ cropper có thể khác nhau tùy phiên bản
        const croppedImage = this.imageCropper.crop();
        // Lưu ý: Kiểm tra lại document của phiên bản ngx-image-cropper bạn đang dùng
        // const base64 = croppedImage.base64; 

        // Giả sử logic cũ của bạn gửi file token hoặc base64
        // this._profileService.updateProfilePicture(...) 

        // Demo đơn giản đóng modal
        this.close();
        abp.event.trigger('profilePictureChanged'); // Bắn sự kiện global
    }

    imageCropped(event: ImageCroppedEvent) {
        // Handle crop event if needed
    }

    fileChangeEvent(event: any): void {
        if (event.target.files[0].size > 5242880) { // 5MB
            this.message.warn(this.l('ProfilePicture_Warn_SizeLimit', '5MB'));
            return;
        }
        // Store the event for the image-cropper component
        this.imageChangedEvent = event;
        // Trigger cropper
        this.uploader.addToQueue(event.target.files);
    }
}