import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-user-list-entry',
  templateUrl: './user-list-entry.component.html',
  styleUrls: ['./user-list-entry.component.css']
})
export class UserListEntryComponent implements OnInit {
  @Input() user!: platformClient.Models.User;
  userAvatar: string = 'assets/default-face.png';

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void { 
    this.userAvatar = this.user.images?.[this.user.images.length - 1]
                          .imageUri || this.userAvatar;
  }

  goToAgentDetails(id: string){
    this.router.navigate(['/user', id]);
  }  
}
