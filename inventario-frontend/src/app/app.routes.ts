import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'productos',
    loadComponent: () =>
      import('./productos/productos.component').then(m => m.ProductosComponent)
  },
  {
    path: 'compras',
    loadComponent: () =>
      import('./compras/compras.component').then(m => m.ComprasComponent)
  },
  {
    path: 'ventas',
    loadComponent: () =>
      import('./ventas/ventas.component').then(m => m.VentasComponent)
  }
];
