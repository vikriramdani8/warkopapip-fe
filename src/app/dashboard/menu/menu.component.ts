import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { clear } from 'console';
import { element } from 'protractor';
import { AppService } from 'src/app/app.service';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./../dashboard.scss']
})
export class MenuComponent implements OnInit {
  alreadyLogin = false;
  userDetail : any;
  profileClick = false;
  order = true;

  orderList = [];

  modal = false;
  register = false;
  hargaTotal = 0;

  formLogin : FormGroup;
  formRegister : FormGroup;

  listFood : any;
  listJenisFood : any;

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  toRupiah(angka){
    var reverse = angka.toString().split('').reverse().join(''),
    ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
  }

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      userpassword: ['', Validators.required]
    });

    this.formRegister = this.fb.group({
      username: ['', Validators.required],
      userpassword: ['', Validators.required],
      useremail: ['', Validators.required],
      userphone: ['', Validators.required],
      jenisuser: ['cust', Validators.required]
    });

    this.getFood();

    if(localStorage.getItem('users')){
      this.userDetail = JSON.parse(localStorage.getItem('users'));
      this.alreadyLogin = true; 

      if(this.userDetail['jenisuser'] == 'adm'){
        this.router.navigateByUrl('/dashboard/admin');
      }
    }
  }

  getFood(){
    this.appService.getFoods().subscribe(data => {
      this.listFood = data;
      this.getJenisFood();
    });
  }

  checkFood(){
    let data = JSON.parse(localStorage.getItem('cart'));
    this.orderList = [];
    this.hargaTotal = 0;
    if(data){
      data.forEach(element => {
        let check = this.listFood.findIndex(element2 => element2['foodid'] == element.foodid);
        this.hargaTotal += this.listFood[check]['foodprice']*element['qty'];        
        this.orderList.push ({
          foodid: element['foodid'],
          qty: element['qty'],
          name: this.listFood[check]['foodname'],
          harga: this.listFood[check]['foodprice']*element['qty']
        });
      });
    }
  }

  getJenisFood(){
    this.appService.getJenisFoods().subscribe(data => {
      this.listJenisFood = data;
      this.checkFood();
    })
  }

  submitLogin(){
    this.appService.login(this.formLogin.value).subscribe(data => {
      if(data){
        this.userDetail = data;
        this.alreadyLogin = true; 
        localStorage.setItem('users', JSON.stringify(this.userDetail));

        this.modal = !this.modal; 
        if(this.userDetail['jenisuser'] == 'adm')
          this.router.navigateByUrl('/dashboard/admin');

      } else {
        alert('Login gagal');
      }
    })
  }

  logout(){
    localStorage.removeItem('users');
    this.clearOrder();

    this.alreadyLogin = false;
    this.userDetail = {};
  }

  filterFood(id){
    let data = [];
    this.listFood.forEach(element => {
      if (element['foodjenisid'] == id) {
        data.push(element);
      }
    });

    return data;
  }

  addToCart(foodid){
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart ? cart : [];

    let check = cart.findIndex(element => element['foodid'] == foodid);
    let checkFood = this.listFood.findIndex(element => element['foodid'] == foodid);
    if(check != -1){
      if (this.listFood[checkFood].stock >= cart[check].qty+1) {
        cart[check].qty=cart[check].qty+1;
      } else {
        alert('stock tidak cukup');
      }
    } else {
      cart.push({
        foodid: foodid,
        qty: 1
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.checkFood();
  }

  removeFood(i){
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart ? cart : [];

    console.clear();

    if(cart[i].qty > 1)
      cart[i].qty = cart[i].qty-1;
    else {
      cart.splice(i, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.checkFood();
  }

  clearOrder(){
    localStorage.removeItem('cart');
    this.checkFood();
  }

  registerAcc(){
    this.appService.register(this.formRegister.value).subscribe(data => {
      this.register = !this.register;
      this.modal = false;
    })
  }

  saveOrder(){
    let data = {
      userid: this.userDetail['userid'],
      orderlist : this.orderList
    }

    localStorage.setItem('orderlist', JSON.stringify(data));
    this.router.navigateByUrl('/dashboard/checkout');
  }

}
