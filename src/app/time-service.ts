import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from './time';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private apiUrl = 'http://localhost:8080/times';

  constructor(private http: HttpClient) {}

  getAllTimes(): Observable<Time[]> {
    return this.http.get<Time[]>(this.apiUrl);
  }

  save(time: Time): Observable<Time> {
    return this.http.post<Time>(this.apiUrl, time);
  }

  update(time: Time): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${time.id}`,
      time
    );
  }

  delete(time: Time): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${time.id}`
    );
  }

  getRanking(): Observable<Time[]> {
    return this.http.get<Time[]>(
      `${this.apiUrl}/ranking`
    );
  }
}
