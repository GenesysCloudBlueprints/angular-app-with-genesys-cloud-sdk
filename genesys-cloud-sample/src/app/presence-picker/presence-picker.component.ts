import { Component, Input, OnInit } from '@angular/core';
import * as platformClient from 'purecloud-platform-client-v2';
import { GenesysCloudService } from '../genesys-cloud.service';

@Component({
  selector: 'app-presence-picker',
  templateUrl: './presence-picker.component.html',
  styleUrls: ['./presence-picker.component.css']
})
export class PresencePickerComponent implements OnInit {
  @Input() user!: platformClient.Models.User;
  languageLabel = 'en_US';
  presenceDefinitions: platformClient.Models.OrganizationPresence[] = [];

  constructor(
    private genesysCloudService: GenesysCloudService,
  ) { }

  ngOnInit(): void {
    this.genesysCloudService.presenceDefinitions.subscribe(p => this.presenceDefinitions = p);
  }

  onPresenceChange(presenceId: string){
    this.genesysCloudService.setUserPresence(this.user.id!, presenceId)
      .subscribe(data => {
        // We just set the local model of the user to the desired presence.
        // A better way might be to reGET the user's presence
        this.user.presence = data;
        console.log('Update presence.') 
      });
  }

  logoutUser() {
    this.genesysCloudService.logoutUser(this.user.id!)
      .subscribe(() => {
        // We just set it to logged out. 
        // A better way might be to reGET the user's presence
        const presenceDefinition = this.user.presence?.presenceDefinition;
        if(presenceDefinition) presenceDefinition.systemPresence = 'Offline';
        console.log('Logged out user.');
      });
  }
}
