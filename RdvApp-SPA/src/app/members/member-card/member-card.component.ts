import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  photoUrl = '';
  @Input() user: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.user.photoUrl) {
      this.photoUrl = this.user.photoUrl;
    } else {
      this.photoUrl = this.authService.photoSubject.getValue();
    }
  }

}
