import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Partida } from '../partida';
import { PartidaService } from '../partida-service';

@Component({
  selector: 'app-partida-component',
  standalone: false,
  templateUrl: './partida-component.html',
  styleUrl: './partida-component.css',
})
export class PartidaComponent implements OnInit {

  partidas = signal<Partida[]>([]);

  formGroupPartida: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: PartidaService
  ) {

    this.formGroupPartida = this.formBuilder.group({
      timeCasa: [''],
      timeVisitante: [''],
      golsCasa: [''],
      golsVisitante: ['']
    });

  }

  ngOnInit(): void {
    this.service.getAllPartidas().subscribe({
      next: json => this.partidas.set(json)
    });
  }

  save() {
    this.service.save(this.formGroupPartida.value).subscribe(
      {
        next: json => {
          this.partidas.update(partidas => [...partidas, json]);
          this.formGroupPartida.reset();
        }
      }
    );
  }

  delete(partida: Partida) {
    this.service.delete(partida).subscribe(
      {
        next: () => {
          this.partidas.update(partidas => partidas.filter(p => p.id !== partida.id));
        }
      }
    )
  }

}