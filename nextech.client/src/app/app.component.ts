import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { AppService } from './app.service';
import { StoryDisplay } from './app.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  storyCount = 500;
  readonly stories = signal<StoryDisplay[]>([]);

  readonly pageNumber = signal(1);
  readonly pageSize = signal(20);

  readonly numberOfPages = computed(() => {
    return Math.floor(this.storyCount / this.pageSize());
  })

  readonly onPageChange = effect(() => {
    this.pageNumber();
    this.pageSize();

    this.getPage();
  })

  constructor(private appService: AppService) { }

  ngOnInit() {
    //todo spinner

    forkJoin([
      this.appService.getStoryCount(),
      this.appService.getStoriesPaged(this.pageNumber(), this.pageSize())
    ]).subscribe({
      next: ([count, pageData]) => {
        this.storyCount = count;
        this.stories.set(pageData);
      }
    })

    //this.appService.getStories().subscribe({
    //  next: (results) => {
    //    console.log(results)
    //    if (!results || results.length === 0) {
    //      // todo: error
    //    }

    //    this.stories = results;
    //  },
    //  error: () => {
    //    // errror
    //  },
    //  complete: () => {
    //    //hidespinner
    //  }
    //});
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

  private getPage() {
    this.appService.getStoriesPaged(this.pageNumber(), this.pageSize()).subscribe({
      next: (results) => {
        console.log(results)
        if (!results || results.length === 0) {
          // todo: error
        }

        this.stories.set(results);
      },
      error: () => {
        // errror
      },
      complete: () => {
        //hidespinner
      }
    })
  }
}
