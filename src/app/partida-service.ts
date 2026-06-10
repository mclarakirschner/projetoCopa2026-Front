import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Partida } from './partida';

@Injectable({
    providedIn: 'root'
})
export class PartidaService {

    apiUrl = 'http://localhost:8080/partidas';

    constructor(private http: HttpClient) { }

    getAllPartidas(): Observable<Partida[]> {
        return this.http.get<Partida[]>(this.apiUrl);
    }

    save(partida: Partida): Observable<Partida> {
        return this.http.post<Partida>(this.apiUrl, partida);
    }

    update(partida: Partida): Observable<void> {
    return this.http.put<void>(
        `${this.apiUrl}/${partida.id}`,
        partida
    );
}

    delete(partida: Partida): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${partida.id}`);
    }

}
