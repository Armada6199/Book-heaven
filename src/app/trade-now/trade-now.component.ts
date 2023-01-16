import {AfterViewInit, Component,ElementRef,ViewChild, OnInit} from '@angular/core';
import {AuthService} from "../shared/Auth/auth.service";

@Component({
  selector: 'app-trade-now',
  templateUrl: './trade-now.component.html',
  styleUrls: ["./trade-now.component.scss"]
})
export class TradeNowComponent implements OnInit, AfterViewInit {
  headsInTop: string[] = ["Your Trade List", "Discover Books"];
  yourTradeList = [];
  OtherBooks: any = [];

  tradeToggleBtn="Show More"
  exchangeToggleBtn="Show More"
  currentExchangeBook;
  currentBookObj;
  initExchange:boolean=false
  onExchange:boolean=false;
  selectedFromTrade:boolean=false;
  selectedFromOffers:boolean=false;
  @ViewChild('scrollTop') scrollTop:ElementRef;

  constructor(private auth: AuthService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.auth.search.updatePosition(true);
    }, 0);
  }

  ngOnInit(): void {
    this.getYouTradeList()
    this.getOtherData()
  }

  getYouTradeList() {
    this.auth.bookService.allOwenedBook().subscribe(res => {
      let ownedBooks = this.auth.shared.removeNoImage(res)
      let ownedBooksC = [];
      ownedBooks.forEach(e => {
        if (e.avaliable == true)
          ownedBooksC.push(e);
      })
      this.yourTradeList = ownedBooksC;
    })
    return this.yourTradeList;
  }

  getOtherData() {
    this.auth.exchange.booksForExchange().subscribe(v => {
      console.log(v)
      this.OtherBooks = v;
      console.log(this.OtherBooks)
    })
  }

  goToBookPage(book: number) {
    this.auth.bookService.transBook(book);
    this.auth.router.navigate(['app/book']).then();
  }

  toggleTrade(contType){

    if(contType.classList.contains("trade-List-cont")){
      let tradeListCont=document.querySelector(".trade-List-cont");
      tradeListCont.classList.toggle("show-more-trade")
      if(tradeListCont.classList.contains("show-more-trade")){
        this.tradeToggleBtn="Show Less"
      } else this.tradeToggleBtn="Show More"


      console.log(tradeListCont)
      return this.tradeToggleBtn
    }else if (contType.classList.contains("exchangable-cont")){
      let exchangeCont=document.querySelector(".exchangable-cont");
      exchangeCont.classList.toggle("show-more-exchange")
      if(exchangeCont.classList.contains("show-more-exchange")){
        this.exchangeToggleBtn="Show Less"
      }else this.exchangeToggleBtn="Show More"

      console.log(exchangeCont)
      return this.exchangeToggleBtn
    }
    return ''

  }

  onExchangeUi(elementId?){
    let exchangeOffers=document.querySelector(".exchange-offers")
    if(elementId!="null"){
      let booksArr=document.querySelectorAll(".book");
      booksArr.forEach(e=>{
        if(e.id==elementId){
          this.currentExchangeBook=e;
        }
      })
      this.yourTradeList.forEach(e=>{
        if(e.id==elementId){
          this.currentBookObj=e;
        }
      })
      this.currentExchangeBook.classList.toggle("onExchange")
      this.onExchange=!this.onExchange
      exchangeOffers.classList.toggle("show-exchange-offers")
      if(exchangeOffers.classList.contains("show-exchange-offers")) this.initExchange=true

    }


  }

  getData(){
    return this.yourTradeList
  }
  initializeExchange(myBook, hisBook) {
    this.auth.exchange.initializeExchange(myBook, hisBook).subscribe(
      (next) => {
        this.auth.toast.success(next['message'], "success")
      },
      error => {
        this.auth.toast.error(error.error['message'], "error")
      }
    );
  }
}
