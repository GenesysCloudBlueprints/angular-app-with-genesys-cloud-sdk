import { Injectable } from '@angular/core';
import { Observable, from, of, BehaviorSubject, forkJoin, EMPTY } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as platformClient from 'purecloud-platform-client-v2';

// Keys for localStorage
const LANGUAGE_KEY = 'gc_language';
const ENV_KEY = 'gc_environment'

@Injectable({
  providedIn: 'root'
})
export class GenesysCloudService {
  private client = platformClient.ApiClient.instance;
  private usersApi = new platformClient.UsersApi();
  private presenceApi = new platformClient.PresenceApi();
  private routingApi = new platformClient.RoutingApi();
  private analyticsApi = new platformClient.AnalyticsApi();
  private tokensApi = new platformClient.TokensApi();

  // Authorization values
  language: string = 'en-us';
  environment: string = 'mypurecloud.com';
  accessToken = '';
  isAuthorized = new BehaviorSubject<boolean>(false);

  // Cache for presence definitions
  presenceDefinitions = new BehaviorSubject<platformClient.Models.OrganizationPresence[]>([]);
  offlinePresenceId = '';

  // Persist search values
  lastUserSearchValue = '';
  lastQueueSearchValue = '';

  constructor() {
    // Try to get saved language and environment information from localstorage
    this.language = localStorage.getItem(LANGUAGE_KEY) || this.language;
    this.environment = localStorage.getItem(ENV_KEY) || this.environment;
  }

  private loginImplicitGrant(): Observable<platformClient.AuthData> {
    return from(this.client.loginImplicitGrant(environment.GENESYS_CLOUD_CLIENT_ID, environment.REDIRECT_URI))
            .pipe(
              map(data => {
                this.accessToken = data.accessToken;
                this.isAuthorized.next(true);
                console.log('User authorized.');

                return data;
              })
            );
  }

  initialize(): Observable<any> {
    this.client.setPersistSettings(true);
    this.client.setEnvironment(this.environment);

    return this.loginImplicitGrant().pipe(
              mergeMap(data => from(this.presenceApi.getPresencedefinitions())),
              tap(data => {
                if(!data.entities) return;

                // Get the ID of the Offline Presence
                this.offlinePresenceId = data.entities
                        .find(p => p.systemPresence === 'Offline')!.id!;

                // Get the list for the other presences
                this.presenceDefinitions.next(
                  data.entities.filter(p => !(p.systemPresence === 'Offline' || p.systemPresence === 'Idle'))
                );
              }),
            );
  }

  setLanguage(language: string | null): void {
    if(language) {
      this.language = language;
      localStorage.setItem(LANGUAGE_KEY, this.language);
    }
  }

  setEnvironment(environment: string | null): void {
    if(environment) {
      this.environment = environment;
      localStorage.setItem(ENV_KEY, this.environment);
    }
  }

  getUserDetails(id: string): Observable<platformClient.Models.User> {
    return from(this.usersApi.getUser(id, { 
        expand: ['routingStatus', 'presence'],
      }));
  }

  getUserMe(): Observable<platformClient.Models.UserMe> {
    return from(this.usersApi.getUsersMe({ 
        expand: ['routingStatus', 'presence'],
      }));
  }

  getUserQueues(userId: string): Observable<platformClient.Models.UserQueue[]> {
    return from(this.routingApi.getUserQueues(userId, { joined: true }))
            .pipe(map(data => data.entities || []));
  }

  getQueueObservations(queueId: string): Observable<platformClient.Models.QueueObservationDataContainer>{
    return from(this.analyticsApi.postAnalyticsQueuesObservationsQuery({
      filter: {
        type: 'or',
        predicates: [
         {
          type: 'dimension',
          dimension: 'queueId',
          operator: 'matches',
          value: queueId
         }
        ]
       },
       metrics: [ 'oOnQueueUsers', 'oActiveUsers' ]
    }))
    .pipe(
      map(data => {
        const result = data.results?.find(r => r.group?.queueId === queueId); 
        if(!result) throw new Error(`No results queried for ${queueId}`);

        return result;
      }),
    );
  }

  setUserPresence(userId: string, presenceId: string): Observable<platformClient.Models.UserPresence> {
    return from(this.presenceApi.patchUserPresencesPurecloud(
        userId, 
        { presenceDefinition: { id: presenceId } }
      ));
  } 

  logoutUser(userId: string): Observable<any> {
    return forkJoin({
        deletetoken: from(this.tokensApi.deleteToken(userId)),
        setOffline: from(this.presenceApi.patchUserPresence(userId, 'PURECLOUD', {
                        presenceDefinition: { id: this.offlinePresenceId }
                    })),
      });
  }

  /**
   * Logout users belonging to the queue. This includes agents that are not
   * 'on-queue'. For this sample app, we'd just take the first 100 members.
   * In order, to get ALL agents, paging of the results is needed.
   * @param queueId The Genesys Cloud Queue Id
   */
  logoutUsersFromQueue(queueId: string): Observable<any> {
    return from(this.routingApi.getRoutingQueueMembers(queueId))
      .pipe(
        mergeMap(result => {
          if(!result.entities) return EMPTY;

          const userLogoutArr = result.entities.map(user => this.logoutUser(user.id!));
          const observables = Object.assign({}, (userLogoutArr));
          console.log(observables)

          return forkJoin(observables);
        })
      )
  }

  searchUsers(term: string): Observable<platformClient.Models.User[]> {
    if(!term.trim()){
      return of([]);
    }

    let searchBody = {
      sortOrder: 'SCORE',
      pageSize: 25,
      pageNumber: 1,
      expand: ['routingStatus', 'presence'],
      query: [{
        type: 'TERM',
        fields: ['name', 'email'],
        value: term,
        operator: 'AND'
      }]
    };

    return from(this.usersApi.postUsersSearch(searchBody))
      .pipe(map(data => data.results || []));
  }

  searchQueues(term: string): Observable<platformClient.Models.Queue[]> {
    return from(this.routingApi.getRoutingQueues({
        pageSize: 10, name: `*${term}*`,
      }))
      .pipe(
        map(data => data.entities || [])
      );
  }
}
