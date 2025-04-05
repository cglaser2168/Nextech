import { Component, OnInit, computed, effect, signal, untracked } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { StoryDisplay } from './app.models';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly storyCount = signal(0);
  readonly searchText = signal('');
  readonly stories = signal<StoryDisplay[]>([]);

  readonly pageNumber = signal(1);
  readonly pageSize = signal(20);

  readonly numberOfPages = computed(() => {
    return Math.ceil(this.storyCount() / this.pageSize());
  })

  readonly onPageChange = effect(() => {
    this.pageNumber();
    this.pageSize();

    untracked(() => {
      this.getPage();
    })
  })

  constructor(
    private appService: AppService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show('spinner');
    this.appService.getNewStories().subscribe({
      next: (results) => {
        console.log(results)

        this.stories.set(results.stories);
        this.storyCount.set(results.recordCount);
      },
      error: () => {
        // errror
      },
      complete: () => {
        this.spinner.hide('spinner');
      }
    });
  }

  firstPage() {
    this.pageNumber.set(1);
  }

  lastPage() {
    // todo rounding?
    this.pageNumber.set(this.numberOfPages());
  }

  previousPage() {
    this.pageNumber.set(this.pageNumber() - 1);
  }

  nextPage() {
    this.pageNumber.set(this.pageNumber() + 1);
  }

  onSizeChange(event: any) {
    this.pageSize.set(event.target.value);
  }

  onSearchChange(event: any) {
    this.searchText.set(event.target.value);
  }

  getPage() {
    console.log(this.searchText())
    this.spinner.show('spinner');
    this.appService.getStoriesPaged(this.pageNumber(), this.pageSize(), this.searchText() !== '' ? this.searchText() : null).subscribe({
      next: (results) => {
        console.log(results)

        this.stories.set(results.stories);
        this.storyCount.set(results.recordCount);
      },
      error: () => {
        this.spinner.hide('spinner');
        // errror
      },
      complete: () => {
        this.spinner.hide('spinner');
      }
    })
  }
}
