import { Component, EventEmitter, OnInit, Output } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-comentario-box',
  templateUrl: './comentario-box.component.html',
  styleUrls: ['./comentario-box.component.css']
})
export class ComentarioBoxComponent implements OnInit {
  @Output() add = new EventEmitter<string>();
  value!: string;
  show = true;
  constructor() {}

  ngOnInit() {}

  post() {
    if (this.value.trim()) {
      this.add.emit(this.value);
      this.value = '';
    }
  }
}

