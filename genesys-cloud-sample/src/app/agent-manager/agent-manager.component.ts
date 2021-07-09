import { Component, OnInit } from '@angular/core';
import { Observable, Subject, merge, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mapTo, switchMap, tap } from 'rxjs/operators';
import { GenesysCloudService } from '../genesys-cloud.service';

import * as platformClient from 'purecloud-platform-client-v2';

@Component({
  selector: 'app-agent-manager',
  templateUrl: './agent-manager.component.html',
  styleUrls: ['./agent-manager.component.css']
})
export class AgentManagerComponent implements OnInit {
  searchTerm = new BehaviorSubject<string>('');
  users$!: Observable<platformClient.Models.User[]>
  fetching = false;

  constructor(
    private genesysCloudService: GenesysCloudService,
  ) { }

  ngOnInit(): void {
    this.users$ = this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.fetching = true; }),
      switchMap((term: string) => this.genesysCloudService.searchUsers(term)),
      tap(() => { this.fetching = false; })
    );
      
    // Set the last searched term
    this.searchTerm.subscribe(term => {
      if(term) this.genesysCloudService.lastUserSearchValue = term;
    });
    
    // If there is a previoulsy searched term, display the results
    if(this.genesysCloudService.lastUserSearchValue){
      this.searchTerm.next(this.genesysCloudService.lastUserSearchValue);
    }
  }

  searchUser(term: string): void {
    this.searchTerm.next(term);
  }
}
