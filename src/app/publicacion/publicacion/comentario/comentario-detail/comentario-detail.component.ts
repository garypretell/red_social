import { Component, Input, OnInit } from '@angular/core';
import { AnyARecord } from 'dns';
import { AuthService } from 'src/app/auth/auth.service';
import { Comentario } from 'src/app/shared/models/comentario.model';
import { ComentarioService } from 'src/app/shared/services/comentario.service';
import { PublicacionService } from 'src/app/shared/services/publicacion.service';
declare var $: any;

@Component({
  selector: 'app-comentario-detail',
  templateUrl: './comentario-detail.component.html',
  styleUrls: ['./comentario-detail.component.css']
})
export class ComentarioDetailComponent implements OnInit {
  @Input() comment!: AnyARecord;
  @Input() publicacion!: any;
  isEditing = false;
  constructor(
    public comentarioService: ComentarioService, public auth: AuthService, public publicacionService: PublicacionService
  ) { }

  ngOnInit() {
   }

  replyClick() {
    this.isEditing = !this.isEditing;
  }

  async onAdd(event: any) {
    const user = await this.auth.getUser();
    const comment: Comentario = {
      parentId: this.comment.id,
      nickname: user.displayName,
      avatar: user.avatar,
      content: event,
      date: +Date.now(),
      publicacionId: this.publicacion.id
    }
    this.comentarioService.addComentario(comment);
    this.publicacionService.incrementarComentario(this.publicacion.id);
  }

}