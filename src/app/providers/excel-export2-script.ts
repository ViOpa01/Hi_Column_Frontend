// import { Workbook } from 'exceljs';
// import * as ExcelJs from 'exceljs/dist/exceljs.min.js';
// import * as ExcelProper from "exceljs";
import { Borders, FillPattern, Font, Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
// These functions are defined here:
// https://github.com/Microsoft/TypeScript/blob/master/lib/lib.webworker.d.ts
// Easiest way to be able to use the Web workers API on our TypeScript files is to declare
// the specific API functions we want to use according to:
// https://github.com/Microsoft/TypeScript/issues/20595#issuecomment-351030256\
declare function postMessage(message: any): void;


export const EXCEL_EXPORT = (input) => {
  // Allocate required libraries
  // Since the host may change, we'll request it from the caller

  // Process the body data
  const data = input.config.body;
  const columns = input.config.columns;
let workbook: Workbook = new Workbook();
  // workbook.creator = 'ITEX';
  // workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Sheet1');

  if(columns){
      worksheet.columns = Object.keys(data[0]).map(key => ({key, width: 30}))
      worksheet.getRow(1).values = columns;
  }
  worksheet.addRows(data);

 workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'export.xlsx');
});
// let workbook2: Workbook = new Workbook();
// workbook2.xlsx.load(buffer)
//   .then(function() {
//     // use workbook
//     // console.log(workbook2.getCell('A1').value)
//   });
  // });

  // Call postMessage with the result data.

  postMessage('hello');
 
};

