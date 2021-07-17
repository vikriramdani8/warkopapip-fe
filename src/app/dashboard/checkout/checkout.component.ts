import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./../dashboard.scss']
})
export class CheckoutComponent implements OnInit {

  profileClick = false;
  alreadyLogin = false;
  userDetail : any;
  orderList = [];

  modal = false;
  register = false;
  hargaTotal = 0;

  listFood : any;
  listJenisFood : any;
  orderDetail: any;
  total = 0;
  
  constructor(
    private appService: AppService
  ) { }

  ngOnInit() {
    this.getFood();

    if(localStorage.getItem('users')){
      this.userDetail = JSON.parse(localStorage.getItem('users'));
      this.alreadyLogin = true; 
    }

    if(localStorage.getItem('orderlist')){
      this.orderDetail = JSON.parse(localStorage.getItem('orderlist'));
      this.orderList = this.orderDetail['orderlist'];

      this.checkTotal();
    }
  }

  toRupiah(angka){
    var reverse = angka.toString().split('').reverse().join(''),
    ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
  }

  getFood(){
    this.appService.getFoods().subscribe(data => {
      this.listFood = data;
    });
  }

  removeFood(i){
    this.orderList.splice(i, 1);
    this.checkTotal();
  }

  checkTotal(){
    this.total = 0;
    this.orderList.forEach(data => {
      this.total += data['harga'];
    })
  }

  completeOrder(){
    let pipe = new DatePipe('en-US');
    let self = this;
    let limit = this.orderList.length;

    upload(0);

    function upload(i){
      
      if(i < limit){
        let datum = {
          foodid: self.orderList[i]['foodid'],
          custid: self.userDetail['userid'],
          qty: self.orderList[i]['qty'],
          price: self.orderList[i]['harga'],
          orderdate: pipe.transform(new Date(), 'short'),
          status: 'Pending'
        }
  
        self.appService.order(datum).subscribe(res => {
          console.log(res);
          upload(i+=1);
        });  
      } else {
        localStorage.removeItem('cart');
        localStorage.removeItem('orderlist');

        alert('Makanan sudah dipesan, silahkan tunggu 10 menit');
        window.history.back();
      }
    }

  }

}
