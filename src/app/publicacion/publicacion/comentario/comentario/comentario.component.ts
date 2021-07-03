import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { data } from 'src/app/data';
import { Comentario } from 'src/app/shared/models/comentario.model';
import { ComentarioService } from 'src/app/shared/services/comentario.service';
import { PublicacionService } from 'src/app/shared/services/publicacion.service';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.css']
})
export class ComentarioComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  src: any;
  comentarioLista: any[] = [];
  comentarios = this.comentarioService.comentarios;
  publicacion: any;
  @Input() comment!: Comentario;
  isEditing = false;
  constructor(
    private activatedroute: ActivatedRoute, public comentarioService: ComentarioService, public publicacionService: PublicacionService
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.comentarioService.unsubscribePaciente();
  }


  ngOnInit() {
    this.activatedroute.paramMap.pipe(map(async params => {
      this.publicacion = await this.publicacionService.publicacionId(params.get('id'));
      await this.comentarioService.loadComentarios(params.get('id'));
    }), takeUntil(this.unsubscribe$)).subscribe();
  }

  getComentario(comments: any): Comentario[] {
    let all: Comentario[] = [];
    all = comments;
    let map = new Map;
    let result: Comentario[] = [];
    let c: Comentario
    for (c of all) {
      if (c.parentId ==  this.publicacion) {
        result.push(c);
      }
      map.set(c.id, c);
    }
    let d: Comentario
    for (d of all) {
      if (d.parentId !=  this.publicacion) {
        let parent: Comentario = map.get(d.parentId);
        if (parent.child == null) {
          parent.child = [];
        }
        parent?.child?.push(d);
      }
    }
    return result;
  }

  async onSubmit(event: any): Promise<any> {
    // const comment: Comentario = {
    //   parentId: null,
    //   nickname: 'Gary',
    //   avatar: "https://wx.qlogo.cn/mmopen/vi_32/Qib5jkFMntPJnT8b2nyzKicoYSuXLeyl07ia1dianxx1fWcic9hJL4UOEuIJvoWWbx7IFia3olUGqiabZvTe0dmeFBicHQ/132",
    //   content: event,
    //   date: Date.now()
    // }
    // console.log()
    // this.comentarioService.addComentario(comment);
    // this.publicacionService.incrementarComentario(3).then((data) => {
    //   console.log(data);
    // });
    // // this.commentService.addComment(comment);
  }


}