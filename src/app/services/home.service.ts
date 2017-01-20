import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { config } from '../configs/app.config';
import 'rxjs/Rx';


@Injectable()
export class HomeService {

    constructor(private http: Http) { }

    getHomeData() {
        let request = `${config.APIUrl}/home`;
        return this.http.get(request)
    }

    getHistory(id){
        let request = `${config.APIUrl}/fixtures/${id}`;
        return this.http.get(request)
    }
}
