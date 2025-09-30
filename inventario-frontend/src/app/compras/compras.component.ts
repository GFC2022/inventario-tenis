import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasService } from '../services/compras';
import { ProductosService } from '../services/productos';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  compras: any[] = [];
  productos: any[] = [];
  nuevaCompra: any = { producto_id: '', cantidad: 0, precio_unitario: 0 };

  constructor(
    private comprasService: ComprasService,
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    this.cargarCompras();
    this.cargarProductos();
  }

  cargarCompras() {
    this.comprasService.getCompras().subscribe({
      next: (data) => (this.compras = data),
      error: (err) => console.error('❌ Error al consultar compras:', err)
    });
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error('❌ Error al consultar productos:', err)
    });
  }

  registrarCompra() {
    this.comprasService.addCompra(this.nuevaCompra).subscribe({
      next: () => {
        this.nuevaCompra = { producto_id: '', cantidad: 0, precio_unitario: 0 };
        this.cargarCompras();
        this.cargarProductos(); // refrescar stock
      },
      error: (err) => console.error('❌ Error al registrar compra:', err)
    });
  }

  cancelarCompra(id: number) {
    if (confirm('¿Seguro que quieres cancelar esta compra?')) {
      this.comprasService.cancelarCompra(id).subscribe({
        next: () => {
          this.cargarCompras();
          this.cargarProductos();
        },
        error: (err) => console.error('❌ Error al cancelar compra:', err)
      });
    }
  }
}
