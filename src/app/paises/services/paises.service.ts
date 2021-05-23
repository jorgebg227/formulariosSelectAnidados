import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private _apiUrl: string = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  get httpSimpleParamsPais(){
    return new HttpParams().set('fields', 'alpha3Code;name');
  }

  get httpSimpleParamsFrontera(){
    return new HttpParams().set('fields', 'borders');
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region:string): Observable<PaisSmall[]>{
    const url = `${this._apiUrl}/region/${region}`;
    return this.http.get<PaisSmall[]>(url, {params: this.httpSimpleParamsPais});
  }

  getPaisPorCodigo(codigo:string): Observable<Pais | null>{
    if( !codigo ) {
      return of(null)
    }
    const url = `${this._apiUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url, {params: this.httpSimpleParamsFrontera});
  }

  getPaisPorCodigoSmall(codigo:string): Observable<PaisSmall>{
    const url = `${this._apiUrl}/alpha/${codigo}`;
    return this.http.get<PaisSmall>(url, {params: this.httpSimpleParamsPais});
  }

  getPaisPorCodigos(borders:string[]): Observable<PaisSmall[]>{
    if( !borders ) {
      return of([])
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    });
    return combineLatest( peticiones );
  }
}
