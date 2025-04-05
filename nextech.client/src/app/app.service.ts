import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StoryPayload } from "./app.models";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { }
  private controllerString = `/Story`;

  getNewStories(): Observable<StoryPayload> {
    return this.http.get<StoryPayload>(`${this.controllerString}/NewStories`);
  }

  getStoriesPaged(pageNumber: number, pageSize: number, searchText: string | null): Observable<StoryPayload> {
    let body = new HttpParams();
    if (searchText !== null) {
      body = body.set('searchText', searchText);
    }

    return this.http.post<StoryPayload>(`${this.controllerString}/PagedStories/${pageNumber}/${pageSize}`, body);
  }
}
