import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs/Observable';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class AppService {
    apiURL: string = 'http://localhost:8080/';
    constructor(private http:HttpClient) {} 
    getFoods() {
        return this.http.get(this.apiURL+'foods/get');
    }

    getJenisFoods() {
        return this.http.get(this.apiURL+'jenisfoods/get');
    }

    login(body){
        return this.http.post(this.apiURL+'users/login', body);
    }

    register(body){
        return this.http.post(this.apiURL+'users/add', body);
    }

    saveFood(body){
        return this.http.post(this.apiURL+'foods/add', body);
    }

    order(body){
        return this.http.post(this.apiURL+'order/add', body);
    }

    getOrder(){
        return this.http.get(this.apiURL+'order/get');
    }

    updateOrder(body, id){
        return this.http.put(this.apiURL+'order/update?id='+id, body);
    }
}