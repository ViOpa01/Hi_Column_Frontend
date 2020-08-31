import { AlertComponent } from './shared/alerts/alert/alert.component';
import { RouterModule, Route, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { NotFoundComponent } from './views/errors/not-found/not-found.component';

// dashboard
import { DashboardComponent } from './views/dashboards/dashboard/dashboard.component';

// user management
import { AuthGuard } from './shared/guards/authGuard';
import { RoleGuard } from './shared/guards/roleGuard';
import { LoginComponent } from './views/auth/login/login.component';



const routes: Route[] = [
  {path: 'login', component: LoginComponent },
  {
    path: '', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {
      allowedRoles: ['admin', 'super', '', 'merchant']
    }, 
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, RoleGuard], data: {
        allowedRoles: ['admin', 'super', '', 'merchant']
      } }
    ]
  },
  {path: 'dispute', loadChildren:  './views/disputes/disputes.module#DisputesModule'},
  {path: 'transaction', loadChildren:  './views/transactions/transactions.module#TransactionsModule'},
  {path: 'settlements', loadChildren:  './views/settlements/settlements.module#SettlementsModule'},

  { path: 'auth', loadChildren:  './views/auth/auth.module#AuthModule'},

  {path: 'merchant', loadChildren: './views/merchant/merchant.module#MerchantModule'},
  {path: 'account', loadChildren: './views/merchant-account/merchant-account.module#AccountModule'},
  {path: 'terminal', loadChildren: './views/terminal/terminal.module#TerminalModule'},
  {path: 'onboarding', loadChildren: './views/merchant-onboard/merchant-onboard.module#MerchantOnboardingModule'},
  {path: 'terminal-inventory', loadChildren: './views/inventory/inventory.module#InventoryModule'},


  {path: 'configuration',  loadChildren: './views/settings/settings.module#SettingsModule'},

  { path: 'alerts', component: AlertComponent },
  { path: '**', component: NotFoundComponent },
];



export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules});
