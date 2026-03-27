import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Models } from 'purecloud-platform-client-v2';
import { PresencePickerComponent } from '../presence-picker/presence-picker.component';
import { QueueDetailsComponent } from '../queue-details/queue-details.component';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css'],
    imports: [PresencePickerComponent, QueueDetailsComponent]
})
export class UserDetailsComponent implements OnInit {
  userId?: string|null;
  userDetails?: Models.UserMe;
  userQueues?: Models.UserQueue[];
  userAvatar: string = 'assets/default-face.png';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private genesysCloudService: GenesysCloudService,
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
  
    this.getUserDetails();
    this.getUserQueues();
  }

  getUserDetails(){
    if(!this.userId) throw Error('Invalid userID.');

    this.genesysCloudService.getUserDetails(this.userId)
      .subscribe(userDetails => {
        this.userDetails = userDetails
        this.userAvatar = userDetails.images?.[userDetails.images.length - 1]
                          .imageUri || this.userAvatar;
      });
  }

  getUserQueues(){
    if(!this.userId) throw Error('Invalid userID.');

    this.genesysCloudService.getUserQueues(this.userId)
      .subscribe(userQueues => {
        this.userQueues = userQueues;
      });
  }

  goBack(){
    this.location.back();
  }
}
