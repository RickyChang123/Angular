import {
  Directive,
  effect,
  inject,
  input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Permission } from './auth.model';
import { AuthService } from './auth.service';

@Directive({
  selector: '[appAuth]',
  standalone: true,
})
export class AuthDirective {
  userType = input.required<Permission>({ alias: 'appAuth' });
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef); //告訴Angular 這directive 會用在ng-template
  private viewContainerRef = inject(ViewContainerRef); //訪問DOM使用此指令(template)的位置

  constructor() {
    effect(() => {
      if (this.authService.activePermission() === this.userType()) {
        this.viewContainerRef.createEmbeddedView(this.templateRef); //讓ng-template內容顯示在螢幕
        console.log('SHOW ELEMENT');
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
