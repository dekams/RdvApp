import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/Pagination';
import { User } from '../_models/user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  likesParam: any;
  pagination: Pagination;

  constructor(private route: ActivatedRoute, private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        this.users = data.users.result;
        this.pagination = data.users.pagination;
      });

    this.likesParam = 'Likers';
  }

  loadUsers(event?: any) {
    if (!event) {
      event = {page: this.pagination.currentPage, itemsPerPage: this.pagination.itemsPerPage};
    }
    this.userService.getUsers(event.page, event.itemsPerPage, null, this.likesParam)
      .subscribe(data => {
        this.users = data.result;
        this.pagination = data.pagination;
      }, error => this.alertify.error(error));
  }

  pageChanged(event) {
    this.loadUsers(event);
  }

}
