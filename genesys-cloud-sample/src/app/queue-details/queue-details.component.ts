import { Component, Input, OnInit } from '@angular/core';
import { GenesysCloudService } from '../genesys-cloud.service';
import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-queue-details',
  templateUrl: './queue-details.component.html',
  styleUrls: ['./queue-details.component.css']
})
export class QueueDetailsComponent implements OnInit {
  @Input() queue?: platformClient.Models.UserQueue|platformClient.Models.Queue;
  onQueueAgents = 0;
  totalAgents = 0;
  fetching = true;

  constructor(
    private genesysCloudService: GenesysCloudService
  ) { }

  ngOnInit(): void {
    this.getQueueObservations();
  }

  getQueueObservations(){
    if(!this.queue) throw Error('Invalid queue.');
    this.fetching = true;

    this.genesysCloudService.getQueueObservations(this.queue.id!)
      .subscribe(result => {
        if(!result.data) throw new Error('Error in getting observations.')

        this.onQueueAgents = result.data
                .filter(d => d.metric === 'oOnQueueUsers')
                .reduce((acc, d) => acc + d.stats!.count!, 0)
        this.totalAgents = result.data
                .find(d => d.metric === 'oActiveUsers')!.stats!.count || 0;
        
        this.fetching = false;
      });
  }

  logoutAgents(){
    if(!this.queue?.id) throw new Error('Empty queue');
    this.fetching = true;

    this.genesysCloudService.logoutUsersFromQueue(this.queue.id)
      .subscribe(data => {
        console.log(`Logged out all agents of ${this.queue?.name}`);
        this.getQueueObservations();
      });
  } 
}
