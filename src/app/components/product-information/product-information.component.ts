import { Component, Input, OnInit } from '@angular/core';

interface ModelData {
  longDescription: string,
  productName: string,
  productSubtitle?: string,
  shortDescription: string,
  image: string,
  catalogId: string,
  learnMore?: string,
  price?: number,
  materialId: string,
  soldTo?: number,
  modal: {
    title: string,
    description: string,
    keepMyCartButtonText: string,
    createNewCartButtonText: string,
    icon: string
  },
  salesOrg: {
    org: string,
    division: string,
    channel: string
  },
  erpSystem: string,
  shoppingCartPage?: string;
  errors: any
};

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.css']
})
export class ProductInformationComponent implements OnInit {


  data: ModelData
  @Input()
  set json(input: string) {
    if (input) {
      this.data = JSON.parse(input);
    }
  }
  constructor() { }

  ngOnInit(): void {
  }
  errorData() {
    return { errors: this.data.errors }
  }
  getAddToButtonData() {
    return JSON.stringify({
      pid: this.data.materialId,
      btnAlignment: 'left',
      soldTo: this.data.soldTo,
      price: this.data.price,
      modal: this.data.modal,
      salesOrg: this.data.salesOrg,
      erpSystem: this.data.erpSystem,
      shoppingCartPage: this.data.shoppingCartPage
    });
  }

}
