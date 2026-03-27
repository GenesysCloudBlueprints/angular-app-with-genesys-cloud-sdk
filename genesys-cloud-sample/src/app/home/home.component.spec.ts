import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { GenesysCloudService } from '../genesys-cloud.service';
import { BehaviorSubject, of } from 'rxjs';

describe('HomeComponent', () => {
  let mockService: Partial<GenesysCloudService>;

  beforeEach(async () => {
    mockService = {
      isAuthorized: new BehaviorSubject<boolean>(true),
      presenceDefinitions: new BehaviorSubject<any[]>([]),
      getUserMe: vi.fn(() => of({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        version: 1,
        images: [{ imageUri: 'https://example.com/avatar.png' }],
      } as any)),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: GenesysCloudService, useValue: mockService },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call getUserMe on init', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(mockService.getUserMe).toHaveBeenCalled();
  });

  it('should populate userDetails after init', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.userDetails).toBeDefined();
    expect(fixture.componentInstance.userDetails!.name).toBe('Test User');
  });

  it('should set the user avatar from response', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.userAvatar).toBe('https://example.com/avatar.png');
  });
});
