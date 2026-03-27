import { TestBed } from '@angular/core/testing';
import { GenesysCloudService } from './genesys-cloud.service';

class MockUsersApi {
  getUser = vi.fn();
  getUsersMe = vi.fn();
  postUsersSearch = vi.fn();
}

class MockPresenceApi {
  getPresencedefinitions = vi.fn();
  patchUserPresencesPurecloud = vi.fn();
  patchUserPresence = vi.fn();
}

class MockRoutingApi {
  getUserQueues = vi.fn();
  getRoutingQueues = vi.fn();
  getRoutingQueueMembers = vi.fn();
}

class MockAnalyticsApi {
  postAnalyticsQueuesObservationsQuery = vi.fn();
}

class MockTokensApi {
  deleteToken = vi.fn();
}

(globalThis as any).platformClient = {
  ApiClient: {
    instance: {
      loginPKCEGrant: vi.fn(),
      setPersistSettings: vi.fn(),
      setEnvironment: vi.fn(),
    },
  },
  UsersApi: MockUsersApi,
  PresenceApi: MockPresenceApi,
  RoutingApi: MockRoutingApi,
  AnalyticsApi: MockAnalyticsApi,
  TokensApi: MockTokensApi,
};

describe('GenesysCloudService', () => {
  let service: GenesysCloudService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenesysCloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default language and environment', () => {
    expect(service.language).toBe('en-us');
    expect(service.environment).toBe('mypurecloud.com');
  });

  it('should start as unauthorized', () => {
    expect(service.isAuthorized.value).toBe(false);
  });

  it('setLanguage should persist to localStorage', () => {
    service.setLanguage('de');
    expect(service.language).toBe('de');
    expect(localStorage.getItem('gc_language')).toBe('de');
  });

  it('setLanguage should ignore null', () => {
    service.setLanguage(null);
    expect(service.language).toBe('en-us');
  });

  it('setEnvironment should persist to localStorage', () => {
    service.setEnvironment('mypurecloud.de');
    expect(service.environment).toBe('mypurecloud.de');
    expect(localStorage.getItem('gc_environment')).toBe('mypurecloud.de');
  });

  it('setEnvironment should ignore null', () => {
    service.setEnvironment(null);
    expect(service.environment).toBe('mypurecloud.com');
  });

  it('searchUsers should return empty array for blank term', async () => {
    const users = await new Promise<any[]>(resolve => {
      service.searchUsers('  ').subscribe(result => resolve(result));
    });
    expect(users).toEqual([]);
  });
});
