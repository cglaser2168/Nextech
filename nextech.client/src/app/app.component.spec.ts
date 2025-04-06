import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { StoryDisplay, StoryPayload } from './app.models';
import { AppService } from './app.service';

interface TestClasses {
  component: AppComponent;
  fixture: ComponentFixture<AppComponent>;
  serviceMock: any;
  spinnerMock: any;
  sampleData: StoryPayload;
}

describe('AppComponent', () => {
  beforeEach(async function (this: TestClasses): Promise<void> {
    this.serviceMock = {
      getNewStories: jasmine.createSpy('getNewStories').and.callFake(() => { return of(this.sampleData) }),
      getStoriesPaged: jasmine.createSpy('getStoriesPaged').and.callFake(() => { return of(this.sampleData) })
    }

    this.spinnerMock = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };

    this.sampleData = {
      recordCount: 2,
      isReset: false,
      stories: [
        { title: 'A sample Title', url: 'hiip://beepboop.gov' },
        { title: 'Not google', url: 'hiip://notgoogle.com' },
      ]
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AppService, useValue: this.serviceMock },
        { provide: NgxSpinnerService, useValue: this.spinnerMock }
      ]
    }).compileComponents();

    this.fixture = TestBed.createComponent(AppComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create the app', function (this: TestClasses) {
    expect(this.component).toBeTruthy();
  });

  it('should get the initial new stories', function (this: TestClasses) {
    this.component.ngOnInit();
    this.fixture.detectChanges();

    expect(this.serviceMock.getNewStories).toHaveBeenCalled();
    expect(this.component.storyCount()).toEqual(2);
    expect(this.component.stories()).toEqual(this.sampleData.stories);
  });

  it('should go to first page', function (this: TestClasses) {
    this.component.firstPage();

    expect(this.component.pageNumber()).toEqual(1);
  });

  it('should go to last page', function (this: TestClasses) {
    this.component.storyCount.set(100);
    this.component.pageSize.set(10);

    this.component.lastPage();

    expect(this.component.pageNumber()).toEqual(10);
  });

  it('should go to the previous page', function (this: TestClasses) {
    this.component.pageNumber.set(5);
    this.component.previousPage();

    expect(this.component.pageNumber()).toEqual(4);
  });

  it('should go to the next page', function (this: TestClasses) {
    this.component.pageNumber.set(5);
    this.component.nextPage();

    expect(this.component.pageNumber()).toEqual(6);
  });

  it('should change the size', function (this: TestClasses) {
    const event = {
      target: {
        value: 15
      }
    };

    this.component.onSizeChange(event);

    expect(this.component.pageSize()).toEqual(15);
  });

  it('should change the search text', function (this: TestClasses) {
    const event = {
      target: {
        value: 'test'
      }
    };

    this.component.onSearchChange(event);

    expect(this.component.searchText()).toEqual('test');
  });

  it('should search stories based on criteria without text', function (this: TestClasses) {
    this.component.pageNumber.set(2);
    this.component.pageSize.set(30);

    this.component.getPage();
    this.fixture.detectChanges();

    expect(this.component.appService.getStoriesPaged).toHaveBeenCalledWith(2, 30, null);
    expect(this.component.stories()).toEqual(this.sampleData.stories);
  });

  it('should search stories based on criteria including text', function (this: TestClasses) {
    this.component.pageNumber.set(2);
    this.component.pageSize.set(30);
    this.component.searchText.set('test');

    this.component.getPage();
    this.fixture.detectChanges();

    expect(this.component.appService.getStoriesPaged).toHaveBeenCalledWith(2, 30, 'test');
    expect(this.component.stories()).toEqual(this.sampleData.stories);
  });

  it('should search stories based on criteria and reset page', function (this: TestClasses) {
    this.sampleData.isReset = true;
    this.component.pageNumber.set(2);
    this.component.pageSize.set(30);
    this.component.searchText.set('test');

    this.component.getPage();
    this.fixture.detectChanges();

    expect(this.component.appService.getStoriesPaged).toHaveBeenCalledWith(2, 30, 'test');
    expect(this.component.stories()).toEqual(this.sampleData.stories);
    expect(this.component.pageNumber()).toEqual(1);
  });
});
