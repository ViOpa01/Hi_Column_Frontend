import { Component, OnInit, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { PurchaseModel } from 'app/Models/receipt.model';
import html2canvas from 'html2canvas';
import * as printJs from 'print-js';
// import * as htmlToImage from 'html-to-image';
// import jsPDF from 'jspdf';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['../../../../assets/receipt.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseComponent implements OnInit {


  @Input('receiptRowData') receiptRowData;
  @Input() isTrans = false;
  @Input('isAll') isAll;
  receipt: any;
  receiptData: PurchaseModel;
  is_printing: boolean;
  tid: string;

  constructor() {
    
  }
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    this.setData(changes.receiptRowData.currentValue);

  }

  setData(row: any) {
    if (row && !this.isTrans) {
      const txnData = row['transaction_data'];
      this.receiptData = {
        merchant_name: txnData['merchantName'],
        address: txnData['address'],
        mid: txnData.mid,
        terminal_id: txnData['tid'],
        date: txnData['date'] || txnData['dateTime'],
        expiryDate: txnData['expiryDate'],
        datetime: txnData['timestamp'] || txnData['dateTime'],
        error: txnData['error'],
        aid: txnData['aid'],
        label: txnData['scheme'],
        mPan: txnData['mPan'],
        payer: txnData['payer'],
        rrn: txnData['rrn'],
        stan: txnData['stan'],
        acode: row['authcode'],
        account_number: txnData['account_number'],   
        amount: txnData['amount'],
        tvr: txnData['tvr'],
        tsi: txnData['tsi'],
        crtm: txnData['crtm'],
        status_message: txnData['message'] || row['response_msg'],
        version: txnData['version'],
        product:txnData['product'],
        _id: row._id,
        merchant_address: row.merchant_address || txnData['merchant_address']
      }
      this.tid = this.receiptData.terminal_id.substring(0, 4);
      
    }else if(row && this.isTrans) {
      const txnData = row['transaction_data'];
      this.receiptData = {
        merchant_name: txnData['merchantName'],
        address: txnData['address'],
        mid: txnData.mid,
        terminal_id: txnData['tid'],
        date: row['transaction_date'],
        expiryDate: '',
        datetime: row['timestamp'],
        error: txnData['error'],
        aid: '',
        label: '',
        mPan: row['pan'],
        payer: '',
        rrn: row['rrn'],
        stan: row['stan'],
        acode: row['authcode'],
        account_number: row['Account'],   
        amount: row['amount'],
        tvr: row['TVR'],
        tsi: row['TSI'],
        crtm: row['CRIM'],
        status_message: row['response_msg'],
        version: row['version'],
        product:row['product'],
        _id: row._id,
        merchant_address:  txnData['merchant_address'] || row.merchant_address 
      }
      this.tid = this.receiptData.terminal_id.substring(0, 4);
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