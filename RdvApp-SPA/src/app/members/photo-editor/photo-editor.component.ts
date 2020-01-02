import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Photo } from 'src/app/_models/photo';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit, OnDestroy {
  @Input() photos: Photo[];

  uploader: FileUploader; // = new FileUploader({url: URL});
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  photoSubscription: Subscription;

  constructor(private authService: AuthService, private userService: UserService, public alertifyService: AlertifyService) { }

  ngOnInit() { this.initializeUploader(); }

  ngOnDestroy() {
    // tslint:disable-next-line:no-unused-expression
    this.photoSubscription && this.photoSubscription.unsubscribe();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/${this.authService.nameId}/photos`,
      authToken: `Bearer ${this.authService.token}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024 // (max 10mb)
    });

    this.uploader.onAfterAddingFile = (file) => file.withCredentials = false;

    this.uploader.onSuccessItem = (item: FileItem, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo: Photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        this.photos.push(photo);

        if (photo.isMain) {
          this.authService.setPhotoUrl(photo.url);
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.photoSubscription = this.userService.setMainPhoto(this.authService.nameId, photo.id)
      .subscribe((next) => {
        const currentMain = this.photos.find(p => p.isMain);
        currentMain.isMain = false;
        photo.isMain = true;
        this.authService.setPhotoUrl(photo.url);
      },
      (error) => this.alertifyService.error(error));
  }

  deletePhoto(photo: Photo) {
    this.alertifyService.confirm('Are you sure you want to delete this photo?', () => {
      this.photoSubscription = this.userService.deletePhoto(this.authService.nameId, photo.id)
      .subscribe((next) => {
        const idx = this.photos.findIndex(p => p.id === photo.id);

        if (idx >= 0) {
          this.photos.splice(idx, 1);
          this.alertifyService.success('Photo has been deleted');
        }
      },
      (error) => this.alertifyService.error('Failed to delete the photo'));
    });
  }
}
