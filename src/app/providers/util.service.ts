import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

    constructor() { }

    addScript() {
        let script = document.createElement('script');
        script.src = `https://cdn.rawgit.com/eligrey/FileSaver.js/5ed507ef8aa53d8ecfea96d96bc7214cd2476fd2/FileSaver.min.js`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.src = `https://printjs-4de6.kxcdn.com/print.min.js`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

}