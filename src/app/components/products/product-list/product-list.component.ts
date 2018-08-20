import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productList: Product[];
  constructor(private productService: ProductService, private toastr: ToastrService) { }

  ngOnInit() {
    this.productService.getProducts() // nos trae todos los datos desde firebase
    .snapshotChanges()  // nos traera todos los cambios que se hagan en la BD
      .subscribe(item => { // eschucahamos los cambios que se hagan, nos trae los item que guardamos en la BD
        this.productList = [];
        item.forEach(element => {
         const x = element.payload.toJSON();
         x['$key'] = element.key;
         this.productList.push(x as Product);
        });
    });
  }

  onEdit(product: Product) {
    // this.productService.selectedProduct = product;
    // Object.assign({}, product) ==> crea una nueva copia del elemento, para no tener 2waydata binding 
    this.productService.selectedProduct = Object.assign({}, product);

  }

  onDelete($key: string ) {
    if (confirm('Are you sure you want to delete it?')) {
      this.productService.deleteProduct($key);
      this.toastr.success('Succesfull Operation', 'Product Deleted');
    }

  }

}
