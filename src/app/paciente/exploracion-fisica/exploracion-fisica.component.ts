import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlergiasComponent } from './alergias/alergias.component';
import { ConsultaSaludComponent } from './consulta-salud/consulta-salud.component';
import { EnfermedadActualComponent } from './enfermedad-actual/enfermedad-actual.component';
import { ExploracionComponent } from './exploracion/exploracion.component';

@Component({
  selector: 'app-exploracion-fisica',
  templateUrl: './exploracion-fisica.component.html',
  styleUrls: ['./exploracion-fisica.component.css']
})
export class ExploracionFisicaComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedIndex = 0;
  @ViewChild('datoContainer', { read: ViewContainerRef }) datoContainer: any;
  componentRef!: ComponentRef<any>;
  activeTab = 0;
  tabs = [
      {
          title: 'Enfermedad Actual',
          component: EnfermedadActualComponent,
      },
      {
          title: 'Consulta de Salud',
          component: ConsultaSaludComponent,
      },
      {
          title: 'Exploración Física',
          component: ExploracionComponent,
      },
      {
          title: 'Alergías',
          component: AlergiasComponent,
      },
  ];
  constructor(
    private cdref: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }


  ngAfterViewInit(): void {
    this.datoContainer.clear();
    const factory =
        this.componentFactoryResolver.resolveComponentFactory(EnfermedadActualComponent);
    this.componentRef = this.datoContainer.createComponent(factory);
    this.cdref.detectChanges();
  }
  ngOnDestroy(): void {
    this.componentRef.destroy();
  }

  ngOnInit(): void {
  }

  onTabChanged(e: any): any {
    this.datoContainer.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
        this.tabs[e].component
    );
    this.componentRef = this.datoContainer.createComponent(factory);
    this.cdref.detectChanges();
}

}
