import { Component, OnInit, signal } from '@angular/core';
import { Time } from '../time';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TimeService } from '../time-service';

@Component({
  selector: 'app-time-component',
  standalone: false,
  templateUrl: './time-component.html',
  styleUrls: ['./time-component.css']
})
export class TimeComponent implements OnInit {

  times = signal<Time[]>([]);

  formGroupTime: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: TimeService) {

    this.formGroupTime = this.formBuilder.group({
      nome: [''],
      grupo: [''],
      pontos: ['']
    })
  }
  ngOnInit(): void {
    this.service.getAllTimes().subscribe(
      {
        next: json => this.times.set(json)
      }
    );
  }

  save() {
    this.service.save(this.formGroupTime.value).subscribe(
      {
        next: json => {
          this.times.update(times => [...times, json]);
          this.formGroupTime.reset();
        }
      }
    );
  }

  delete(time: Time) {
    this.service.delete(time).subscribe(
      {
        next: () => {
          this.times.update(times => times.filter(t => t.id !== time.id));
        }
      }
    )
  }

}
