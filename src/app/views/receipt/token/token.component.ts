import { Component, OnInit, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { TokenModel } from 'app/Models/receipt.model';
import html2canvas from 'html2canvas';
import  ImageModel  from 'app/Models/image.model';
import * as printJs from 'print-js';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['../../../../assets/receipt.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TokenComponent implements OnInit {


  @Input('receiptRowData') receiptRowData;
  @Input() isTrans = false;
  @Input('isAll') isAll;
  receipt: any;
  receiptData: TokenModel;
  imageData = ImageModel;  
  is_printing: boolean;
  name: string;

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
      let name = ''
      let unit = ''
      let type = ''
      let meter = ''
      if(txnData['response']){
        name = txnData['response']['name'] || txnData['response']['payer'] || ''
        unit = txnData['response']['unit_value'] || txnData['response']['units'] || ''
        type = txnData['response']['accountType'] || txnData['response']['account_type']|| txnData['response']['type'] || txnData['response']['productType'] || ''        
        meter = txnData['response']['meterNumber'] || txnData['response']['customerMeterNumber'] || txnData['response']['customerMeterNo'] || ''
        
      }
      this.receiptData = {
        merchant_name: txnData['merchantName'],
        address: txnData['address'],
        mid: txnData['mid'],
        terminal_id: txnData['terminal'] || row['terminal_id'],
        txn_tid: txnData['tid'],
        type: txnData['type'] == 'NIL' ? type : txnData['type'] || type,
        error: txnData['error'],
        wallet: txnData['wallet'],
        reference: `${txnData['reference']}`.slice(0,28),
        payment: txnData['paymentMethod'],
        payer: txnData['payer'],
        name: txnData['VASCustomerName'] || name ,
        transactionID: txnData['transactionID'],
        tran_id: txnData['tran_id'],
        VASCustomerAddress: txnData['VASCustomerAddress'],
        acctType: txnData['acctType'],
        debit: txnData['debit'],
        token: txnData['token'],
        unit:  txnData['unit'] || txnData['response'] ? txnData['response']['unit'] : '',
        unit_value: txnData['unit_value'] || unit,
        vat: txnData['vat'] || txnData['response'] ? txnData['response']['vat'] : '',
        cardName: txnData['cardName'],
        mPan: txnData['mPan'],
        aid: txnData['aid'],
        label: txnData['scheme'],
        expiryDate: txnData['expiryDate'],
        stan: txnData['stan'],
        rrn: txnData['rrn'],
        resp: row['response_code'],
        acode: row['authcode'],
        meter: txnData['meter'] || meter,
        account: txnData['account'],
        date: txnData['date'] || txnData['dateTime'],
        datetime: txnData['timestamp'] || txnData['dateTime'],
        amount: txnData['amount'],
        status_message: txnData['message'] || row['response_msg'],
        version: txnData['version'],
        product:txnData['product'],
        _id: row._id,
        merchant_address: row.merchant_address || txnData['merchant_address']
    }
      
    this.name =  this.imageData[this.receiptData.product.toUpperCase()]
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
      loader.remove();
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
