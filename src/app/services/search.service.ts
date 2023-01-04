import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Observable} from "rxjs";
import {IGenure} from '../shared/Interfaces/IGenure';
import {SharedServiceService} from './shared-service.service';

@Injectable({providedIn: 'root'})
export class SearchPageService {
  baseSearchUrl = environment.apiUrl + "search/"
  html = ""
  targetedUrl = "https://www.goodreads.com/book/show/11358368-pop-star"
  constructor(private http: HttpClient, private sharedService: SharedServiceService) {}
  searchBy(targetSearch: string,targetType:string) {
    return this.http.get<IGenure[]>(this.baseSearchUrl+targetType+"/"+ targetSearch)
  }
}
