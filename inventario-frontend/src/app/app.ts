import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Barra de navegación -->
    <nav class="navbar navbar-expand-lg navbar-light bg-primary bg-gradient px-3">
      <a class="navbar-brand text-white fw-bold" [routerLink]="'/'" role="button">Inventario de Tenis</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link text-white" [routerLink]="'/'" routerLinkActive="active" role="button">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" [routerLink]="'/productos'" routerLinkActive="active" role="button">Productos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" [routerLink]="'/compras'" routerLinkActive="active" role="button">Compras</a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" [routerLink]="'/ventas'" routerLinkActive="active" role="button">Ventas</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Contenido dinámico -->
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
