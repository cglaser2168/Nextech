import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StoryDisplay } from "./app.models";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { }
  private controllerString = `/Story`;

  getStoryCount(): Observable<number> {
    return this.http.get<number>(`${this.controllerString}/StoryCount`);
  }

  getStoriesPaged(pageNumber: number, pageSize: number): Observable<StoryDisplay[]> {
    return this.http.get<StoryDisplay[]>(`${this.controllerString}/PagedStories/${pageNumber}/${pageSize}`);
  }
}
