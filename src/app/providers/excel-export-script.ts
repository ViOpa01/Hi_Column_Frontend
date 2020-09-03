import { WorkSheet, WorkBook } from 'xlsx';
import { e } from '@angular/core/src/render3';

// These functions are defined here:
// https://github.com/Microsoft/TypeScript/blob/master/lib/lib.webworker.d.ts
// Easiest way to be able to use the Web workers API on our TypeScript files is to declare
// the specific API functions we want to use according to:
// https://github.com/Microsoft/TypeScript/issues/20595#issuecomment-351030256
declare function importScripts(...urls: string[]): void;
declare function postMessage(message: any): void;

// Declare the library object so the script can be compiled without any problem
declare const XLSX: any;

export const EXCEL_EXPORT = (input) => {
  // Allocate required libraries
  // Since the host may change, we'll request it from the caller
  importScripts(`${input.protocol}//${input.host}/scripts/xlsx.full.min.js`);

  // Process the body data
  const workbook: WorkBook = XLSX.utils.book_new();

  let worksheet: WorkSheet
  let data: any = []


  if (input.config.multiple == true) {
    for (let i = 0; i < input.config.body.length; i++) {
      data = []
      input.config.body[i].map(item => {
        data.push({ ...item });
        return item;
      })

      worksheet = XLSX.utils.json_to_sheet(data);

      var range = XLSX.utils.decode_range(worksheet['!ref']);
      var fmt = '#,##0.00';

      if (input.config.columns) {


        for (let j = 0; j < input.config.columns.index.length; j++) {

          console.log(i, input.config.columns.index[j])
          if (i == input.config.columns.index[j]) {

            let column = input.config.columns.names[j]


            var C = range.s.r; /* start in the first row */
            /* walk every column in the range */
            // XLSX.SSF.format('$#,##0.00', 12345.6789)

            for (var C = range.s.r; C <= column.length; ++C) {

              var address = XLSX.utils.encode_col(C) + "1"; // <-- first row, column number C

              if (!worksheet[address]) {
                continue;
              }

              worksheet[address].v = column[C]

            }
          }
        }

      }

      for (let d = range.s.r + 1; d <= range.e.r; ++d) {
        // var colNum = XLSX.utils.encode_col(i);
        /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
        // console.log(colNum)
        for (var f = 0; f <= range.e.c; f++) {
          var ref = XLSX.utils.encode_cell({ r: d, c: f });
          /* if the particular row did not contain data for the column, the cell will not be generated */
          console.log(worksheet[ref])
          if (!worksheet[ref]) continue;
          /* `.t == "n"` for number cells */
          if (worksheet[ref].t != 'n') continue;
          /* assign the `.z` number format */
          worksheet[ref].z = fmt;

        }

      }

      XLSX.utils.book_append_sheet(workbook, worksheet, input.config.name[i]);
    }

  } else {
    data = input.config.body;
    worksheet = XLSX.utils.json_to_sheet(data);


    var range = XLSX.utils.decode_range(worksheet['!ref']);
    var fmt = '#,##0.00';

    if (input.config.columns) {
      let column = input.config.columns


      var C = range.s.r; /* start in the first row */
      /* walk every column in the range */
      // XLSX.SSF.format('$#,##0.00', 12345.6789)

      for (var C = range.s.r; C <= column.length; ++C) {

        var address = XLSX.utils.encode_col(C) + "1"; // <-- first row, column number C

        if (!worksheet[address]) {
          continue;
        }

        worksheet[address].v = column[C]

      }
      //decode_col converts Excel col name to an integer for col #
    }
    for (var i = range.s.r + 1; i <= range.e.r; ++i) {
      // var colNum = XLSX.utils.encode_col(i);
      /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
      // console.log(colNum)
      for (var j = 0; j <= range.e.c; j++) {
        var ref = XLSX.utils.encode_cell({ r: i, c: j });
        /* if the particular row did not contain data for the column, the cell will not be generated */
        console.log(worksheet[ref])
        if (!worksheet[ref]) continue;
        /* `.t == "n"` for number cells */
        if (worksheet[ref].t != 'n') continue;
        /* assign the `.z` number format */
        worksheet[ref].z = fmt;

      }

    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  }

  const writtenBook = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

  // Call postMessage with the result data.
  postMessage(writtenBook);
};

