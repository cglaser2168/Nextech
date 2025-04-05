import { Component, effect, signal } from '@angular/core';
import { AppService } from './app.service';
import { StoryDisplay } from './app.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stories: StoryDisplay[] = [];

  readonly pageNumber = signal(1);
  readonly pageSize = signal(20);

  readonly onPageChange = effect(() => {
    this.pageNumber();
    this.pageSize();

    this.getPage();
  })

  constructor(private appService: AppService) {
    //todo spinner
    this.appService.getStories().subscribe({
      next: (results) => {
        console.log(results)
        if (!results || results.length === 0) {
          // todo: error
        }

        this.stories = results;
      },
      error: () => {
        // errror
      },
      complete: () => {
        //hidespinner
      }
    });
  }

  private getPage() {
    this.appService.getStoriesPaged(this.pageNumber(), this.pageSize()).subscribe({
      next: (results) => {
        console.log(results)
        if (!results || results.length === 0) {
          // todo: error
        }

        this.stories = results;
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
