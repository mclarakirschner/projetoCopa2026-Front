import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Partida } from '../partida';
import { PartidaService } from '../partida-service';
import { TimeService } from '../time-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-partida-component',
  standalone: false,
  templateUrl: './partida-component.html',
  styleUrl: './partida-component.css',
})
export class PartidaComponent implements OnInit {

  partidas = signal<Partida[]>([]);
  times: any[] = [];
  idEditando: number | null = null;

  formGroupPartida: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: PartidaService,
    private timeService: TimeService
  ) {

    this.formGroupPartida = this.formBuilder.group({
      timeCasaId: [''],
      timeVisitanteId: [''],
      golsCasa: [''],
      golsVisitante: ['']
    });
  }

  ngOnInit(): void {

    this.service.getAllPartidas().subscribe({
      next: json => this.partidas.set(json)
    });

    this.timeService.getAllTimes().subscribe({
      next: json => this.times = json
    });
  }

  save() {

    if (
      this.formGroupPartida.value.timeCasaId ==
      this.formGroupPartida.value.timeVisitanteId
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'O time da casa e o visitante não podem ser iguais.'
      });
      return;
    }

    if (!this.formGroupPartida.value.timeCasaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Selecione o time da casa.'
      });
      return;
    }

    if (!this.formGroupPartida.value.timeVisitanteId) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Selecione o time visitante.'
      });
      return;
    }

    if (
      this.formGroupPartida.value.golsCasa === null ||
      this.formGroupPartida.value.golsCasa === ''
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Informe os gols do time da casa.'
      });
      return;
    }

    if (
      this.formGroupPartida.value.golsVisitante === null ||
      this.formGroupPartida.value.golsVisitante === ''
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Informe os gols do time visitante.'
      });
      return;
    }

    if (
      this.formGroupPartida.value.golsCasa < 0 ||
      this.formGroupPartida.value.golsVisitante < 0
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Os gols não podem ser negativos.'
      });
      return;
    }

    if (this.idEditando) {

      const partida = {
        ...this.formGroupPartida.value,
        id: this.idEditando
      };

      this.service.update(partida).subscribe({
        next: () => {

          this.service.getAllPartidas().subscribe({
            next: json => this.partidas.set(json)
          });

          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Partida atualizada com sucesso!'
          });

          this.formGroupPartida.reset();
          this.idEditando = null;
        }
      });

    } else {

      this.service.save(this.formGroupPartida.value).subscribe({
        next: json => {

          this.partidas.update(p => [...p, json]);

          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Partida cadastrada com sucesso!'
          });

          this.formGroupPartida.reset();
        }
      });

    }
  }

  edit(partida: Partida) {
    this.idEditando = partida.id;

    this.formGroupPartida.patchValue({
      timeCasaId: partida.timeCasaId,
      timeVisitanteId: partida.timeVisitanteId,
      golsCasa: partida.golsCasa,
      golsVisitante: partida.golsVisitante
    });
  }

  delete(partida: Partida) {

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta partida será excluída permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.isConfirmed) {

        this.service.delete(partida).subscribe({

          next: () => {

            this.partidas.update(
              partidas => partidas.filter(
                p => p.id !== partida.id
              )
            );

            Swal.fire({
              icon: 'success',
              title: 'Excluída!',
              text: 'Partida removida com sucesso.'
            });
          }

        });

      }

    });

  }
}
