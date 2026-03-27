import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import { Models } from 'purecloud-platform-client-v2';
import { PresencePickerComponent } from '../presence-picker/presence-picker.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    imports: [PresencePickerComponent]
})
export class HomeComponent implements OnInit {
  userDetails?: Models.UserMe;
  userAvatar: string = 'assets/default-face.png';

  constructor(private genesysCloudService: GenesysCloudService) {
  }

  ngOnInit(): void {
   this.getUserDetails();
  }

  getUserDetails(){
    this.genesysCloudService.getUserMe()
      .subscribe(userDetails => {
        this.userDetails = userDetails
        this.userAvatar = userDetails.images?.[userDetails.images.length - 1]
                          .imageUri || this.userAvatar;
      });
  }
}
