import { NotLoggedGuard } from 'src/app/guards/not-logged.guard';
import { HomePage } from 'src/app/pages/home/home.page';
import { SignInPage } from 'src/app/pages/sign-in/sign-in.page';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', component: HomePage, canActivate: [MsalGuard] },
  { path: 'sign-in', component: SignInPage, canActivate: [NotLoggedGuard] },

  {
    path: 'rsi',
    loadChildren: () =>
      import('projects/rsi/src/app/app.module').then((m) => m.AppRsiSharedModule), canActivate: [MsalGuard],
      data: {groups: ['c7865db8-b3dc-4bc2-85c6-d7b9926cd36e','6257620f-27d6-4aeb-81bb-223e995020f4']}
  },
  {
    path: 'ifd',
    loadChildren: () =>
      import('projects/ifd/src/app/app.module').then((m) => m.AppIfdSharedModule), canActivate: [MsalGuard],
      data: {groups: ['6257620f-27d6-4aeb-81bb-223e995020f4','c7865db8-b3dc-4bc2-85c6-d7b9926cd36e']}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
