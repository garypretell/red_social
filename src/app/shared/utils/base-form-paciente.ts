import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseFormPaciente {
  private isValidInput = /^[-a-zA-Z0-9.',+:-_ ]+$/;
  private isValidNumber = /^[0-9]+$/;
  private isValidEmail = /\S+@\S+\.\S+/;
  errorMessage = null;

  baseForm = this.fb.group({
    nombres: ['', [Validators.minLength(1), Validators.maxLength(50), Validators.pattern(this.isValidInput), Validators.required]],
    apellidos: ['', [Validators.minLength(1), Validators.maxLength(50), Validators.pattern(this.isValidInput), Validators.required]],
    sexo: ['', [Validators.required]],
    dni: ['', [Validators.minLength(8), Validators.maxLength(8), Validators.pattern(this.isValidNumber), Validators.required]],
    estadoCivil: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    celular: ['', [Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.isValidInput)]],
    correo: ['', [Validators.maxLength(50), Validators.pattern(this.isValidEmail)]],
    direccion: ['', [Validators.maxLength(255), Validators.pattern(this.isValidInput)]],
    observacion: ['', [Validators.maxLength(255), Validators.pattern(this.isValidInput)]],
    usuarioId: ['']
  });

  constructor(private fb: FormBuilder) { }

  errors(ctrl: AbstractControl): string[] {
    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }

  handleError(error: any, field: string): void {
    const { errors } = this.baseForm.get(field)!;
    const minlenght = errors?.minlength?.requiredLength;
    const maxlenght = errors?.maxlength?.requiredLength;
    const messages: any = {
      required: 'Campo requerido.',
      pattern: field === 'dni' ? 'Solo se aceptan números' : field === 'correo' ? 'Ingrese correo válido.' : 'Existen caracteres no válidos.',
      minlength: `Este campo debe tener como mínimo ${minlenght} caracter(es)`,
      maxlength: `Este campo debe ser menor o igual a ${maxlenght} caracteres`,
    };

    return messages[error];

  }
}
