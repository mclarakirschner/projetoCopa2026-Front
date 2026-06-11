import { Component, OnInit, signal } from '@angular/core';
import { Time } from '../time';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TimeService } from '../time-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-time-component',
  standalone: false,
  templateUrl: './time-component.html',
  styleUrls: ['./time-component.css']
})
export class TimeComponent implements OnInit {

  times = signal<Time[]>([]);
  idEditando: number | null = null;

  formGroupTime: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: TimeService
  ) {

    this.formGroupTime = this.formBuilder.group({
      nome: [''],
      grupo: [''],
      pontos: [{ value: 0, disabled: true }]
    });

  }

  ngOnInit(): void {
    this.carregarTimes();
  }

  carregarTimes() {
    this.service.getAllTimes().subscribe({
      next: json => this.times.set(json)
    });
  }

  save() {

    const form = this.formGroupTime.getRawValue();

    // ======================
    // PADRONIZAÇÃO GRUPO
    // ======================
    form.grupo = form.grupo?.toUpperCase();

    // ======================
    // VALIDAÇÕES
    // ======================

    if (!form.nome?.trim()) {
      Swal.fire('Erro', 'Informe o nome do time.', 'error');
      return;
    }

    if (form.nome.trim().length < 3) {
      Swal.fire('Erro', 'Nome deve ter pelo menos 3 caracteres.', 'error');
      return;
    }

    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(form.nome)) {
      Swal.fire('Erro', 'Nome não pode conter números.', 'error');
      return;
    }

    if (!form.grupo) {
      Swal.fire('Erro', 'Informe o grupo.', 'error');
      return;
    }

    if (!/^[A-H]$/.test(form.grupo)) {
      Swal.fire('Erro', 'Grupo deve ser entre A e H.', 'error');
      return;
    }

    const qtdGrupo = this.times().filter(
      t => t.grupo === form.grupo && t.id !== this.idEditando
    ).length;

    if (qtdGrupo >= 4) {
      Swal.fire('Erro', 'Este grupo já possui 4 times.', 'error');
      return;
    }

    const existe = this.times().some(
      t =>
        t.nome?.trim().toLowerCase() === form.nome.trim().toLowerCase() &&
        t.id !== this.idEditando
    );

    if (existe) {
      Swal.fire('Erro', 'Já existe um time com esse nome.', 'error');
      return;
    }

    // ======================
    // UPDATE
    // ======================
    if (this.idEditando) {

      const time: Time = {
        id: this.idEditando,
        nome: form.nome,
        grupo: form.grupo,
        pontos: form.pontos
      };

      this.service.update(time).subscribe({
        next: () => {
          this.carregarTimes();

          Swal.fire('Sucesso', 'Time atualizado!', 'success');

          this.formGroupTime.reset({ pontos: 0 });
          this.idEditando = null;
        }
      });

    }

    // ======================
    // CREATE
    // ======================
    else {

      this.service.save({
        nome: form.nome,
        grupo: form.grupo,
        pontos: 0
      } as Time).subscribe({
        next: () => {

          this.carregarTimes();

          Swal.fire('Sucesso', 'Time cadastrado!', 'success');

          this.formGroupTime.reset({ pontos: 0 });
        }
      });

    }
  }

  edit(time: Time) {

    this.idEditando = time.id!;

    this.formGroupTime.patchValue({
      nome: time.nome,
      grupo: time.grupo?.toUpperCase(),
      pontos: time.pontos
    });
  }

  delete(time: Time) {

    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse time será excluído!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {

      if (result.isConfirmed) {

        this.service.delete(time).subscribe({
          next: () => {
            this.carregarTimes();
            Swal.fire('Deletado!', 'Time removido com sucesso.', 'success');
          }
        });

      }

    });
  }
}
