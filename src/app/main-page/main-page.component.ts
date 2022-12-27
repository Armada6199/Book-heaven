import {Component, OnInit,} from '@angular/core';
import {MainPageService} from "../services/main-page.service";
import {Book} from "../shared/Interfaces/Book";
import {environment} from "../../environments/environment.prod";
import {HttpClient} from "@angular/common/http";
import {SharedServiceService} from '../services/shared-service.service';
import {searchDataTransferService} from "../services/Transfer/search-data-transfer.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  providers: [MainPageService]
})
export class MainPageComponent implements OnInit {
  topNArr = []
  MostRated = [];

  constructor(private http: HttpClient, private mainPS: MainPageService,
              private sharedService: SharedServiceService,private search:searchDataTransferService) {
  }

  ngOnInit(): void {
    this.search.updatePosition(true);
    this.http.get<Book[]>(`${environment.apiUrl}/topn`).subscribe((x) => {
      this.MostRated = x
      console.log(this.MostRated);
    });
    this.getTopN();

    /*const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];
console.log(animals.slice(2));
// expected output: Array ["camel", "duck", "elephant"]


let animals5 = []
for (i =0;i<5; i++ ) {animals5[i]=animals.slice(i,i+2)}
console.log(animals5)
    */
  }

  getTopN() {
    this.mainPS.getTopTen().subscribe(res => {
      this.topNArr = res
      this.topNArr = this.sharedService.removeNoImage(this.topNArr)
      this.topNArr.forEach(e => {

        e.cover_page = this.sharedService.getLargeImg(e.cover_page, this.sharedService.getPosition(e.cover_page, "m/", 2))
      })
    })
  }

  imgPath = "https://books.google.com/books/publisher/content/images/frontcover/SSRGEAAAQBAJ?fife=w480-h690"
  headsInTop: string[] = ["Top 10 Books", "Besed On Similar Users"];
  images = [1055, 194].map((n) => `https://picsum.photos/id/${n}/900/500`);
  images2 = [123, 14, 38, 63].map((n) => `https://picsum.photos/id/${n}/900/500`);
  images3 = [15, 134, 4, 434].map((n) => `https://picsum.photos/id/${n}/900/500`);
  allimg = [this.images, this.images2, this.images3];


}
