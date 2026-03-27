import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenesysCloudService } from '../genesys-cloud.service';
import { Models } from 'purecloud-platform-client-v2';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { QueueDetailsComponent } from '../queue-details/queue-details.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-queue-list-page',
    templateUrl: './queue-list-page.component.html',
    styleUrls: ['./queue-list-page.component.css'],
    imports: [QueueDetailsComponent, AsyncPipe]
})
export class QueueListPageComponent implements OnInit {
  searchTerm = new BehaviorSubject<string>('');
  queues$!: Observable<Models.Queue[]>
  fetching = false;

  constructor(
    private genesysCloudService: GenesysCloudService,
  ) { }

  ngOnInit(): void {
    this.queues$ = this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.fetching = true; }),
      switchMap((term: string) => this.genesysCloudService.searchQueues(term)),
      tap(() => { this.fetching = false; })
    );

    // Set the last searched term
    this.searchTerm.subscribe(term => {
      if(term) this.genesysCloudService.lastQueueSearchValue = term;
    });
    
    // If there is a previoulsy searched term, display the results
    if(this.genesysCloudService.lastQueueSearchValue){
      this.searchTerm.next(this.genesysCloudService.lastQueueSearchValue);
    }
  }

  searchQueue(term: string): void {
    this.searchTerm.next(term);
  }
}
