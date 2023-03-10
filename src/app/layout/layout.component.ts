import {Component, OnInit} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {AuthService} from "../shared/Auth/auth.service";
import {Router, NavigationEnd} from '@angular/router';
import {searchDataTransferService} from "../services/Transfer/search-data-transfer.service";
import {filter} from "rxjs";
import {MessagesService} from "../services/message/messages.service";
import {BookDataService} from "../services/Transfer/book-data.service";
import {SharedServiceService} from "../services/shared-service.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  searchValue: string = '';
  positionInSearch = true;
  profilePic = "";
  conver = [];


  constructor(private auth: AuthService, private search: searchDataTransferService,
              private router: Router, private message: MessagesService,
              private dataService: BookDataService, private shared: SharedServiceService) {
  }


  ngOnInit(): void {

    this.auth.getUserProfile().subscribe(data => {
      if (!localStorage.getItem('userData') || !localStorage.getItem("interests")) {
        localStorage.setItem("userData", JSON.stringify(data));
        let myObj = JSON.parse(localStorage.getItem("userData"));

        if (!myObj.interest) {
          let intr=[];
          this.auth.main.basedInYourInterst().subscribe(data => {
            data.forEach(e => {
              let x = e['genres'].toString().replace(/[{}']/gi, "").split(',')
              x.forEach(ele => {
                intr.push(ele)
              })
              intr = [...new Set(intr)];
            })
            myObj.interest = myObj.interest ? myObj.interest.toLowerCase() : intr;
            localStorage.setItem("interests", (myObj.interest));
          })
        }else localStorage.setItem("interests", (myObj.interest));

        localStorage.setItem("userData", JSON.stringify(myObj));
        this.profilePic = JSON.parse(localStorage.getItem("userData")).profileImageUrl;
      }
      this.profilePic = JSON.parse(localStorage.getItem("userData")).profileImageUrl
    });

    this.search.updatePosition(true);
    this.search.currentPosition.subscribe(x => this.positionInSearch = x);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
      (event: NavigationEnd) => {
        document.querySelector("#mat-drawer-content").scroll({top: 0, left: 0})
      });
  }

  myDrawer: MatDrawer;

  toggleDrawer(ref: MatDrawer) {
    this.myDrawer = ref;
    ref.toggle().then();
    if (ref.opened)
      this.message.getAllConversation().subscribe(data => {
        data.forEach(x => {
            /*get img for the book*/
            this.dataService.getBook(+x['his_book_id']).subscribe((book) => {
              book["coverPage"] = this.shared.getLargeImg(book["coverPage"], this.shared.getPosition(book["coverPage"], "m/", 2))
              x.imgUrl = book["coverPage"]
            });
          }
        );
        if (data != []) {
          this.conver = data;
        }
      });
  }

  LogOut() {
    this.auth.doLogout();
  }

  onEnter() {
    this.search.updateData(this.searchValue);
    this.searchValue = '';
    this.router.navigate(['app/search']).then();
  }
  goToC(x,y) {
    this.message.setMessageID(x,y);
    this.myDrawer.toggle().then();
    this.router.navigate(['app/message']).then()
  }
}
