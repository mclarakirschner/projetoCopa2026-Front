import { Component, OnInit, signal } from '@angular/core';
import { Time } from '../time';
import { TimeService } from '../time-service';

@Component({
  selector: 'app-ranking-component',
  standalone: false,
  templateUrl: './ranking-component.html',
  styleUrl: './ranking-component.css'
})
export class RankingComponent implements OnInit {

  times = signal<Time[]>([]);

  constructor(private service: TimeService) { }

  ngOnInit(): void {
    this.service.getAllTimes().subscribe({
      next: json => {
        const ordenado = [...json].sort((a, b) => b.pontos - a.pontos);
        this.times.set(ordenado);
      }
    });
  }
}