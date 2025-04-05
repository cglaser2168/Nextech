import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StoryDisplay } from "./app.models";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { }
  private controllerString = `/Story`;

  getStories(): Observable<StoryDisplay[]> {
    return this.http.get<StoryDisplay[]>(`${this.controllerString}/NewStories`);
  }

  getStoriesPaged(pageNumber: number, pageSize: number): Observable<StoryDisplay[]> {
    return this.http.get<StoryDisplay[]>(`${this.controllerString}/PagedStories/${pageNumber}/${pageSize}`);
  }
}
