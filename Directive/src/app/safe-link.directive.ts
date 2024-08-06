import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: 'a[appSafeLink]',
  standalone: true,
  host: {
    '(click)': ' onConfirmLeavePage($event)',
  },
})
export class SafeLinkDirective {
  queryparam = input('myapp', { alias: 'appSafeLink' });

  private hostElementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  constructor() {
    console.log('SafeLinkDirective is active');
  }

  onConfirmLeavePage(event: MouseEvent) {
    const wantToLeave = window.confirm('Do you want to leave the app');

    // if (wantToLeave) {
    //   const address = (event.target as HTMLAnchorElement).href;
    //   (event.target as HTMLAnchorElement).href =
    //     address + '?from=' + this.queryparam();
    //   return;
    // }

    //用inject的
    if (wantToLeave) {
      const address = this.hostElementRef.nativeElement.href;
      this.hostElementRef.nativeElement.href =
        address + '?from=' + this.queryparam();
      return;
    }

    event?.preventDefault(); //防止瀏覽器的預設行為，根據用戶選擇阻止/不阻止導航到其他頁面
  }
}
