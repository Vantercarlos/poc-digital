import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ifd';

  constructor(private msalService: MsalService){}

  getTokenClaims(){
    return this.msalService.instance.getActiveAccount()?.idTokenClaims
  }
}
