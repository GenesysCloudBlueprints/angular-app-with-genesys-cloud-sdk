import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Models } from 'purecloud-platform-client-v2';
import { PresencePickerComponent } from '../presence-picker/presence-picker.component';

@Component({
    selector: 'app-user-list-entry',
    templateUrl: './user-list-entry.component.html',
    styleUrls: ['./user-list-entry.component.css'],
    imports: [PresencePickerComponent]
})
export class UserListEntryComponent implements OnInit {
  @Input() user!: Models.User;
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
