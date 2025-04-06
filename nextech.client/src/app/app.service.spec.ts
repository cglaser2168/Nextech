import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { StoryDisplay } from './app.models';
import { AppService } from './app.service';
import { HttpClient, HttpParams } from '@angular/common/http';

interface TestClasses {
  service: AppService;
  httpMock: any;
  sampleData: StoryDisplay[];
}

describe('AppService', () => {
  beforeEach(async function (this: TestClasses): Promise<void> {
    this.httpMock = {
      get: jasmine.createSpy('get').and.returnValue(of(this.sampleData)),
      post: jasmine.createSpy('post').and.returnValue(of(this.sampleData))
    };

    this.sampleData = [
      { title: 'A sample Title', url: 'hiip://beepboop.gov' },
      { title: 'Not google', url: 'hiip://notgoogle.com' },
    ];

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: this.httpMock }
      ]
    })

    this.service = TestBed.inject(AppService);
  });

  it('should create', function (this: TestClasses) {
    expect(this.service).toBeTruthy();
  });

  it('should get new stories', function (this: TestClasses) {
    this.service.getNewStories();
    expect(this.httpMock.get).toHaveBeenCalledWith('/Story/NewStories');
  });

  it('should get a page of stories', function (this: TestClasses) {
    this.service.getStoriesPaged(1, 20, null);
    expect(this.httpMock.post).toHaveBeenCalledWith('/Story/PagedStories/1/20', new HttpParams());
  });
});
