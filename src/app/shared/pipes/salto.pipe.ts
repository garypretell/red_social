import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ name: 'salto' })
export class SaltoPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(mensaje: string) {
        mensaje = mensaje.split('\n').join('<br />');
        return mensaje;
    }
}