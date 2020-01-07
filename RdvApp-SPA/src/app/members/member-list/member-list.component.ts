import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/Pagination';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  user: User;
  users: User[];
  pagination: Pagination;
  userParams: any = {};
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  @ViewChild('myPagination', { static: true }) myPagination: PaginationComponent;

  // tslint:disable-next-line: max-line-length
  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.authService.currentUser;
    this.userParams.gender = (this.user.gender === 'female') ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';

    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });
   }

   resetFilter() {
    this.userParams.gender = (this.user.gender === 'female') ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
   }

   pageChanged(event) {
    this.loadUsers(event);
   }

  loadUsers(event?: any) {
    if (!event) {
      event = {page: this.pagination.currentPage, itemsPerPage: this.pagination.itemsPerPage};
    }
    this.userService.getUsers(event.page, event.itemsPerPage, this.userParams)
      .subscribe(data => {
        this.users = data.result;
        this.pagination = data.pagination;
      }, error => this.alertify.error(error));
  }
}
