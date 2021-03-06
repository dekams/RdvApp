import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  photoUrl = '';
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService,  private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
      this.getImages();
      if (this.user.photoUrl) {
        this.photoUrl = this.user.photoUrl;
      } else {
        this.photoUrl = this.authService.photoSubject.getValue();
      }
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
  }

  getImages() {
    this.galleryImages = [];
    for (const photo of this.user.photos) {
      this.galleryImages = [...this.galleryImages, {
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      }];
    }
  }

}
