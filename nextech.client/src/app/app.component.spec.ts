import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoryDisplay } from './app.models';
import { AppService } from './app.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let serviceMock: any;

  beforeEach(async () => {
    serviceMock: {
      getNewStories: jasmine.createSpy('getNewStories').call
    }

    await TestBed.configureTestingModule({
    declarations: [AppComponent],
    imports: [],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
      { provide: AppService, useValue: serviceMock }
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    serviceMock = TestBed.inject(HttpTestingController);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve weather forecasts from the server', () => {
    const mockStories: StoryDisplay[] = [
      { title: 'A sample Title', url: 'hiip://beepboop.gov' },
      { title: 'Not google', url: 'hiip://notgoogle.com' },
    ];

    component.ngOnInit();

    expect()
    const req = httpMock.expectOne('/weatherforecast');
    expect(req.request.method).toEqual('GET');
    req.flush(mockForecasts);

    expect(component.forecasts).toEqual(mockForecasts);
  });
});
