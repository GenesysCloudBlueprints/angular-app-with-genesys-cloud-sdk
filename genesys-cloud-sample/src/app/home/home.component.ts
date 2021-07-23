import { Component, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userDetails?: platformClient.Models.UserMe;
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
