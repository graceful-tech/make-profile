import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { RewardsSuccessMessageComponent } from '../shared/components/rewards-success-message/rewards-success-message.component';
 
@Injectable({ providedIn: 'root' })
export class PopupService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {}

  open(data?: {candidate?: any; template?:any; nickNames?:any}) {
    const factory = this.resolver.resolveComponentFactory(RewardsSuccessMessageComponent);
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);

     if (data?.candidate) componentRef.instance.candidate = data.candidate;
     if (data?.template) componentRef.instance.template = data.template;
    if (data?.nickNames) componentRef.instance.nickNames = data.nickNames;

 
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);
  }
}
