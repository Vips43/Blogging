const ExcelJS = require('exceljs');

async function fillNestedExcelTemplate() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('template.xlsx');
  const worksheet = workbook.getWorksheet(1); 

  // Your nested data structure
  const branchesData = [
    {
      branch: 'Mumbai Main',
      subbranches: [
        { subbranch: 'Borivali West', categories: ['Retail Banking', 'Corporate Services', 'Loan Department'] },
        { subbranch: 'Andheri East', categories: ['Retail Banking', 'Wealth Management'] }
      ]
    },
    {
      branch: 'Delhi Central',
      subbranches: [
        { subbranch: 'Connaught Place', categories: ['Corporate Services', 'NRI Banking'] }
      ]
    }
  ];

  let currentRow = 5; // Starting row in your template below the logo/header

  branchesData.forEach((bItem) => {
    const branchStartRow = currentRow;

    bItem.subbranches.forEach((sItem) => {
      const subbranchStartRow = currentRow;

      sItem.categories.forEach((category) => {
        const row = worksheet.getRow(currentRow);
        
        // Write values to cells
        row.getCell(1).value = bItem.branch;
        row.getCell(2).value = sItem.subbranch;
        row.getCell(3).value = category;

        // Apply basic alignment so merged text sits nicely in the center
        row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
        row.getCell(2).alignment = { vertical: 'middle', horizontal: 'left' };
        row.getCell(3).alignment = { vertical: 'middle', horizontal: 'left' };

        row.commit();
        currentRow++;
      });

      const subbranchEndRow = currentRow - 1;
      // Merge Sub-branch column (Column B / 2) if it spans multiple categories
      if (subbranchStartRow < subbranchEndRow) {
        worksheet.mergeCells(subbranchStartRow, 2, subbranchEndRow, 2);
      }
    });

    const branchEndRow = currentRow - 1;
    // Merge Branch column (Column A / 1) if it spans multiple sub-branches/categories
    if (branchStartRow < branchEndRow) {
      worksheet.mergeCells(branchStartRow, 1, branchEndRow, 1);
    }
  });

  // Apply borders to all newly populated cells to keep the sheet clean
  for (let r = 5; r < currentRow; r++) {
    const row = worksheet.getRow(r);
    for (let c = 1; c <= 3; c++) {
      row.getCell(c).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }

  await workbook.xlsx.writeFile('final_hierarchical_report.xlsx');
  console.log('Hierarchical Excel sheet generated successfully!');
}

fillNestedExcelTemplate();
