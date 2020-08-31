import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs';

@Injectable()
export class AsdevApiService {
  private rootURL = 'https://asdev-apis.appspot.com/';
  // private rootURL = 'localhost:8080/';
  constructor(private http: Http) { }

  login(mobile, password): Promise<any> {
    let apiURL = `${this.rootURL}auth/login`;
    let body = `{
  "mobile": ${encodeURIComponent(mobile)},
  "xpin": ${encodeURIComponent(password)}
}`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.post(apiURL, body, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }

  GetCategories(): Promise<any> {
    let apiURL = `${this.rootURL}api/category/`;
    let promise = this.http.get(apiURL)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  GetCategoriesSummary(): Promise<any> {
    let apiURL = `${this.rootURL}api/category/Summary/0?hasProducts=false`;
    let promise = this.http.get(apiURL)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  GetParentCategorByChildID(childId): Promise<any> {
    let apiURL = `${this.rootURL}api/category?childId=${childId}`;
    let promise = this.http.get(apiURL)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }

  updateCategory(model): Promise<any> {
    let apiURL = `${this.rootURL}api/Admin/categories`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + localStorage.Token);
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.put(apiURL, model, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }

  addCategory(model): Promise<any> {
    let apiURL = `${this.rootURL}api/Admin/categories`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + localStorage.Token);
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.post(apiURL, model, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }

  getStats(): Promise<any> {
    let apiURL = `${this.rootURL}api/Admin/statistics`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + localStorage.Token);
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }

  getPayStackTransactions(status): Promise<any> {
    let apiURL = `https://api.paystack.co/transaction?status=${status}&perPage=20000000`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer sk_test_4456a31abc5ac95d7708668d963cb3f74317667a');
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  getPayStackTransactionById(id): Promise<any> {
    let apiURL = 'https://api.paystack.co/transaction/' + id;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer sk_test_4456a31abc5ac95d7708668d963cb3f74317667a');
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }

  getCountries(): Promise<any> {
    let apiURL = `${this.rootURL}api/utility/countries?size=248`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + localStorage.Token);
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  getBanksByCountry(id): Promise<any> {
    let apiURL = `${this.rootURL}api/utility/banks/${id}`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + localStorage.Token);
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  getOnboardingStats(): Promise<any> {
    let apiURL = `${this.rootURL}api/Admin/users?size=2000`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + localStorage.Token);
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  getOnboardingStatsByBank(bank): Promise<any> {
    let apiURL = `${this.rootURL}api/Admin/users?size=2000&bank=${bank}`;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'bearer ' + localStorage.Token);
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  //open -a Google\ Chrome --args --disable-web-security --user-data-dir
  getMailStats(from, to): Promise<any> {
    // from='2017-09-19T00:00:00Z';to='2018-09-26T00:00:00Z';
    let apiURL = `https://api.mailjet.com/v3/REST/messagestatistics?FromTS=${from}&ToTS=${to}&ShowContactAlt=true&ShowSubject=true`;
    var headers = new Headers();
    headers.append('Authorization', 'basic ' + btoa('0cbc67974b762ed6b7e268b59776e9a9' + ":" + '5b2be236ea0f5e08e01ad166bebe7d88'));
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
  getMails(from, to): Promise<any> {
    // from='2017-09-19T00:00:00Z';to='2018-09-26T00:00:00Z';
    let apiURL = `https://api.mailjet.com/v3/REST/message?FromTS=${from}&ToTS=${to}&ShowContactAlt=true&ShowSubject=true&Limit=0`;
    var headers = new Headers();
    headers.append('Authorization', 'basic ' + btoa('0cbc67974b762ed6b7e268b59776e9a9' + ":" + '5b2be236ea0f5e08e01ad166bebe7d88'));
    let options = new RequestOptions({ headers: headers });
    let promise = this.http.get(apiURL, options)
      .map((res: any) =>
        res.json()).toPromise()
    return promise;
  }
}
