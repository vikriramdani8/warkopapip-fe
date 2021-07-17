import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  formFood : FormGroup;
  formTypeOfFood : FormGroup;

  listFood : any;
  listJenisFood : any;
  listOrder = [];
  userDetail : any;

  profileClick = false;
  alreadyLogin = false;
  order = true;
  addFood = false;

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
    this.formFood = this.fb.group({
      foodjenisid: ['', Validators.required],
      foodname: ['', Validators.required],
      fooddesc: ['', Validators.required],
      foodprice: ['', Validators.required],
      stock: ['', Validators.required],
      urlimage: ['', Validators.required]
    });

    this.formTypeOfFood = this.fb.group({
      jenisfoodname: ['', Validators.required],
    });

    this.getFood();

    if(localStorage.getItem('users')){
      this.userDetail = JSON.parse(localStorage.getItem('users'));
      this.alreadyLogin = true; 
    }
  }

  getFood(){
    this.appService.getFoods().subscribe(data => {
      this.listFood = data;
      this.getJenisFood();
    });
  }

  getOrder(){
    function eliminateDuplicates(arr) {
      var i,
          len = arr.length,
          out = [],
          obj = {};
    
      for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
      }
      for (i in obj) {
        out.push(i);
      }
      return out;
    }
    
    let arrTemp = [];
    let tempOrder = []
    let listOrder = [];
    let tai = [];
    this.appService.getOrder().subscribe((data : any )=> {
      data.forEach(el => {
        if(el['status'] == 'Pending'){
          tempOrder.push(el);
          arrTemp.push(el['custid']);
        }
      });

      arrTemp = eliminateDuplicates(arrTemp);
      console.log(tempOrder);

      arrTemp.forEach(el => {
        listOrder = [];

        tempOrder.forEach(el2 => {
          if (el == el2['custid']) {
            if (el2) {
              listOrder.push(el2);
            }
          }
        })

        tai.push({
          custid: el,
          orderList: listOrder
        })
      });

      tai.forEach(temp => {
        temp.orderList.forEach(element1 => {
          this.listFood.forEach(element2 => {
            if (element1['foodid'] == element2['foodid']) {
              element1.detail = element2;
            }
          });
        });

        this.listOrder.push(temp);
      })
    });

  }

  getJenisFood(){
    this.appService.getJenisFoods().subscribe(data => {
      this.listJenisFood = data;
      this.getOrder();
    })
  }

  logout(){
    localStorage.removeItem('users');
    this.alreadyLogin = false;
    this.userDetail = {};
    window.history.back();
  }

  saveFood(){
    this.appService.saveFood(this.formFood.value).subscribe(data => {
      this.formFood.reset();
    })
  }

  orderComplete(data){
    const dat = data;
    let obj = [];

    dat.forEach(element => {
      obj.push({
        custid: element['custid'],
        foodid: element['foodid'],
        orderdate: element['orderdate'],
        orderid: element['orderid'],
        price: element['price'],
        qty: element['qty'],
        status: "Success"
      });
    });

    let self = this;

    upload(0)
    function upload(i){
      if (i < obj.length) {
        self.appService.updateOrder(obj[i], obj[i].orderid).subscribe(res => {
          console.log(res);
            upload(i+=1);
        });  
      } else {
        alert("Order updated");
        window.location.reload();
        
        this.getOrder();
      }
    }
  }

}
