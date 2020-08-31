import { Component, OnInit, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { SmallModel } from 'app/Models/receipt.model';
import  ImageModel  from 'app/Models/image.model';

import html2canvas from 'html2canvas';
import * as printJs from 'print-js';

@Component({
  selector: 'app-small',
  templateUrl: './small.component.html',
  styleUrls: ['../../../../assets/receipt.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SmallComponent implements OnInit {


  @Input('receiptRowData') receiptRowData;
  @Input() isTrans = false;
  @Input('isAll') isAll;
  receipt: any;
  receiptData: SmallModel;
  imageData = ImageModel;  
  is_printing: boolean;
  name: string;
  mobile: boolean;
  tv: boolean;
  smile: boolean;

  constructor() {
    
  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    this.setData(changes.receiptRowData.currentValue);

  }

  setData(row: any) {
    if (row) {
      
      
      const txnData = row['transaction_data'];
      let smartcard = ''
      let type = ''
      if(txnData['response']){
        smartcard = txnData['response']['smartCardCode'] || ''
        type = txnData['response']['type'] || ''
      }
      this.receiptData = {
        merchant_name: txnData['merchantName'],
        address: txnData['address'],
        mid: txnData['mid'],
        terminal_id: txnData['terminal'],
        vasCategory: txnData['vasCategory'],
        error: txnData['error'],
        wallet: txnData['wallet'],
        reference: `${txnData['reference']}`.slice(0,28),
        VASCustomerName: txnData['VASCustomerName'],
        recipient: txnData['VASCustomerAccount'],
        payment: txnData['paymentMethod'],
        transactionID: txnData['transactionID'],
        iuc: txnData['iuc'],
        cardName: txnData['cardName'],
        mPan: txnData['mPan'],
        aid: txnData['aid'],
        label: txnData['scheme'],
        expiryDate: txnData['expiryDate'],
        stan: txnData['stan'],
        rrn: txnData['rrn'],
        resp: row['response_code'],
        acode: row['authcode'],
        date: txnData['date'] || txnData['dateTime'],
        datetime: txnData['timestamp'] || txnData['dateTime'],
        amount: txnData['amount'],
        status_message: txnData['message'] || row['response_msg'],
        smartcard: txnData['smartCardCode'] || smartcard,
        version: txnData['version'],
        product: txnData['product'],
        category: txnData['category'], 
        type: txnData['type'] || type,
        VASCustomerPackageName: txnData['VASCustomerPackageName'],
        _id: row._id,
        merchant_address: row.merchant_address || txnData['merchant_address']
      }
      if(this.receiptData.category == 'TV') {
        this.tv = true;
      } else {
        this.tv = false;
      }
      if(this.receiptData.product == 'SMILE') {
        this.smile = true;
      } else {
        this.smile = false;
      }

      if(this.receiptData.product.toLowerCase() == 'multichoice'){
        this.name = this.imageData[this.receiptData.type.toUpperCase()]
      }else {
        this.name =  this.imageData[this.receiptData.product.toUpperCase()]
      }
     
  } 
}

  printTicket(event, id) {
    var printContents = document.getElementById(id).innerHTML;

    const element = document.createElement('div');
    element.style.display = 'none';
    element.innerHTML = printContents;

    document.body.append(element);

    const loader = document.createElement('i');
    loader.classList.add('fa', 'fa-spinner', 'fa-spin');
    event.target.append(loader);
    
    setTimeout(()=> {

      document.getElementById('root').style.display = 'none';
      document.querySelector('.modal-backdrop').setAttribute('style', 'display: none')
      element.style.display = 'block';
      window.focus();
      window.print();
      document.getElementById('root').style.display = 'flex';
      document.querySelector('.modal-backdrop').setAttribute('style', 'display: block')
  
      element.remove();
      loader.remove();
    },1500)
  }

  exportTicket(event, id) {
    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '_';
    const time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    const name = `export${date}${time}.jpg`;
    this.is_printing = true;
    var printContents = document.getElementById(id).innerHTML;

    const element = document.createElement('div');
    element.style.display = 'none';
    element.innerHTML = printContents;

    document.body.append(element);

    const loader = document.createElement('i');
    loader.classList.add('fa', 'fa-spinner', 'fa-spin');
    event.target.append(loader);

      setTimeout(() => {

      document.getElementById('root').style.display = 'none';
      element.style.display = 'block';
      document.querySelector('.modal-backdrop').setAttribute('style', 'display: none')
      html2canvas(document.body).then((canvas) => {
        this.saveAs(canvas.toDataURL(), `${name}`)
        document.getElementById('root').style.display = 'flex';
        document.querySelector('.modal-backdrop').setAttribute('style', 'display: block')

        element.remove();
        loader.remove();
      })
    }, 1500)
  }


  saveAs(uri, filename) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);

    } else {

      window.open(uri);

    }
  }
}
