import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall, Pais } from '../../interfaces/pais.interface';
import { PaisService } from '../../services/paises.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];


  // UI
  cargando:boolean = false;


  constructor(
    private fb: FormBuilder,
    private paisesService: PaisService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // Cuando cambie la región
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap( region => this.paisesService.getPaisesPorRegion(region) )
      )
      .subscribe( paises => {
        this.paises = paises;
        this.cargando = false;
      });

    // Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap( pais => this.paisesService.getPaisPorCodigos(pais?.borders!))
      )
      .subscribe( paises => {
        this.fronteras = paises;
        this.cargando = false;
      });
  }

  guardar(){
    console.log(this.miFormulario.value);
  }
}
