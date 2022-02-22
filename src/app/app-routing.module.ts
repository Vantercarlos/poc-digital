import { HomePage } from 'src/app/pages/home/home.page';
import { SignInPage } from 'src/app/pages/sign-in/sign-in.page';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';
import { IfdAuthGuard } from './guards/ifd-auth.guard';
import { RsiAuthGuard } from './guards/rsi-auth.guard';

const routes: Routes = [
  { path: '', component: HomePage, canActivate: [MsalGuard] },
  { path: 'sign-in', component: SignInPage, canActivate: [MsalGuard] },

  {
    path: 'rsi',
    loadChildren: () =>
      import('projects/rsi/src/app/app.module').then((m) => m.AppRsiSharedModule), canActivate: [RsiAuthGuard]
  },
  {
    path: 'ifd',
    loadChildren: () =>
      import('projects/ifd/src/app/app.module').then((m) => m.AppIfdSharedModule), canActivate: [IfdAuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
