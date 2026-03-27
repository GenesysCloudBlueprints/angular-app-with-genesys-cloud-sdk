import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { GenesysCloudService } from './genesys-cloud.service';
import { BehaviorSubject, EMPTY } from 'rxjs';

describe('AppComponent', () => {
  let mockService: Partial<GenesysCloudService>;

  beforeEach(async () => {
    mockService = {
      isAuthorized: new BehaviorSubject<boolean>(false),
      setLanguage: vi.fn(),
      setEnvironment: vi.fn(),
      initialize: vi.fn(() => EMPTY),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: GenesysCloudService, useValue: mockService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe("Yuri's Angular App");
  });

  it('should render nav links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('nav a');
    expect(links.length).toBe(3);
    expect(links[0].textContent).toContain('Home');
    expect(links[1].textContent).toContain('User Search');
    expect(links[2].textContent).toContain('Queues List');
  });

  it('should start as unauthorized and show the spinner', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeNull();
    expect(compiled.querySelector('.spinner')).toBeTruthy();
  });

  it('should show router-outlet when authorized', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    (mockService.isAuthorized as BehaviorSubject<boolean>).next(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.isAuthorized).toBe(true);
  });
});
