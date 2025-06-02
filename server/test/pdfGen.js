((pdfKitHelper) => {
  const PDFDocument = require('pdfkit');
  const path = require('path');

  pdfKitHelper.generateHr = async (doc, y) => {
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
  };

  pdfKitHelper.generateHeader = async (doc) => {
    doc.image(path.join(__dirname, '../assests/main_logo.png'), 60, 30, { align: 'center' }).moveDown();
    pdfKitHelper.generateHr(doc, 90);
  };

  pdfKitHelper.generateStatementFooter = async (doc, txnReport) => {
    pdfKitHelper.generateHr(doc, 720);
    doc
      .fontSize(8)
      .font('Times-Roman')
      .text('Phone: 01-4456783', 50, 740, { align: 'left', width: 500 })
      .text(`${txnReport.data.branchName.toLowerCase()}, Nepal`, 50, 740, { align: 'right', width: 500 })
      .text('Email : info@gibl.com.np', 50, 750, { align: 'left', width: 500 });
  };

  pdfKitHelper.generatetxnReport = async (doc, txnReport) => {
    const str = txnReport.data.createdDate;
    const date = new Date(str);
    const mnth = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const res = [date.getFullYear(), mnth, day].join('-') + ' ' + time + ' ' + ampm;
    doc.fontSize(16).font('Times-Bold').text('Transaction Receipt', 100, 130, { align: 'center' });

    let val = '';
    if (txnReport.data.transactionAttributes != '[object Object]') {
      Object.values(JSON.parse(txnReport.data.transactionAttributes)).length > 0
        ? Object.values(JSON.parse(txnReport.data.transactionAttributes)).map((eachValue, index) => {
          if (index > 0) val = `${val}/${eachValue}`;
          else val += eachValue;
        })
        : val = '-';
    }
    let bankCode = [
      'FEFUND',
      'FEIBFT',
      'FESFND',
      'FESIFT',
      'FESMPT',
      'FEUTPT',
      'FELAPT',
      'FESFW',
      'FESPT'
    ];
    let x1 = 50;
    doc.y = 170;
    let x2 = 500;
    let x6 = 400;
    if (bankCode.includes(txnReport.data.productCode) || bankCode.includes(txnReport.data.featureCode)) {
      doc
        .fontSize(10)
        .rect(x1, doc.y, x2, 255)
        .moveTo(300, doc.y)
        .lineTo(300, doc.y + 255)

        .moveDown(0.8)
        .font('Times-Roman')
        .text('Transaction Id', x1, doc.y, { indent: 5, align: 'left', width: 140, height: doc.currentLineHeight() })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.transactionReferenceCode}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Transaction Date', x1, doc.y, { indent: 5, align: 'left', width: 140, height: doc.currentLineHeight() })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${res}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Feature Name', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.code}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Amount', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${(Math.round(txnReport.data.transactionAmount * 100) / 100).toFixed(2)}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Charge', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${(Math.round(txnReport.data.charge * 100) / 100).toFixed(2)}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Discount', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${(Math.round(txnReport.data.discount * 100) / 100).toFixed(2)}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Processed By', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.userFullName}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Channel', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.channel === '1' ? 'Web' : 'Mobile'}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Description', x1, doc.y + 10, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 10, x2, 0)
        .moveUp()
        .text(`${val ? val : '-'}`, 280, doc.y, { align: 'right' })
        .moveDown(1)

        .text('Reward Points', x1, doc.y + 5, { indent: 5, align: 'left' })
        .rect(x1, doc.y, x2, 0)
        .moveUp()
        .text(`${txnReport.data.reward}`, x6, doc.y, { align: 'right' })
        .moveDown(1)

        .text('Status', x1, doc.y - 5, { indent: 5, align: 'left' })
        .rect(x1, doc.y, x2, 0)
        .moveUp()
        .text(`${txnReport.data.status}`, x6, doc.y, { align: 'right' })
        .moveDown()

        .text('Remarks', x1, doc.y - 5, { indent: 5, align: 'left' })
        // .rect(x1, doc.y + 5, x2, 0)
        .moveUp(1)
        .text(`${txnReport.data.remarks}`, x6, doc.y, { align: 'right' })
        .moveDown(1);
    } else {
      doc
        .fontSize(10)
        .rect(x1, doc.y, x2, 260)
        .moveTo(300, doc.y)
        .lineTo(300, doc.y + 260)

        .moveDown(0.8)
        .font('Times-Roman')
        .text('Transaction Id', x1, doc.y, { indent: 5, align: 'left', width: 140, height: doc.currentLineHeight() })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.transactionReferenceCode}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Transaction Date', x1, doc.y, { indent: 5, align: 'left', width: 140, height: doc.currentLineHeight() })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${res}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Feature Name', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.code}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Amount', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${(Math.round(txnReport.data.transactionAmount * 100) / 100).toFixed(2)}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Charge', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${(Math.round(txnReport.data.charge * 100) / 100).toFixed(2)}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Discount', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${(Math.round(txnReport.data.discount * 100) / 100).toFixed(2)}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Processed By', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.userFullName}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Channel', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.channel === '1' ? 'Web' : 'Mobile'}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8)

        .text('Description', x1, doc.y + 10, { indent: 5, align: 'left' })
        .rect(x1, doc.y, x2, 0)
        .moveUp()
        .text(`${val ? val : '-'}`, x6, doc.y, { align: 'right' })
        .moveDown(1)

        .text('Reward Points', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y, x2, 0)
        .moveUp()
        .text(`${txnReport.data.reward}`, x6, doc.y, { align: 'right' })
        .moveDown(1)

        .text('Status', x1, doc.y, { indent: 5, align: 'left' })
        .rect(x1, doc.y, x2, 0)
        .moveUp()
        .text(`${txnReport.data.status}`, x6, doc.y, { align: 'right' })
        .moveDown(1)

        .text('Remarks', x1, doc.y, { indent: 5, align: 'left' })
        // .rect(x1, doc.y + 5, x2, 0)
        .moveUp()
        .text(`${txnReport.data.remarks}`, x6, doc.y, { align: 'right' })
        .moveDown(0.8);
    }

    /*
     * doc
     *     .fontSize(10)
     *     .font("Times-Bold")
     *     .text(`${txnReport.data.transactionReferenceCode}`, 50, 130, { align: "right" })
     *     .text(`${res}`, 50, 150, { align: "right" })
     *     .text(`${txnReport.data.code}`, 50, 170, { align: "right" })
     *     .text(`${txnReport.data.transactionAmount}`, 50, 190, { align: "right" })
     *     .text(`${txnReport.data.charge}`, 50, 210, { align: "right" })
     *     .text(`${txnReport.data.discount}`, 50, 230, { align: "right" })
     *     .text(`${txnReport.data.reward}`, 50, 250, { align: "right" })
     *     .text(`${txnReport.data.status}`, 50, 270, { align: "right" })
     *     .text(`${txnReport.data.remarks}`, 50, 290, { align: "right" })
     */
  };

  pdfKitHelper.createTxnReportPdf = async (txnReport, res, path) => {
    let doc = new PDFDocument({ size: 'A4', margin: 50 });
    await Promise.all([pdfKitHelper.generateHeader(doc), pdfKitHelper.generatetxnReport(doc, txnReport), pdfKitHelper.generateStatementFooter(doc, txnReport)]);

    /*
     * doc.pipe(fs.createWriteStream(path));
     * res.writeHead(200, {
     *     'Content-Type': 'application/pdf',
     *     'Access-Control-Allow-Origin': '*'
     * });
     */
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename=${path}.pdf`);
    doc.pipe(res);
    doc.end();
  };
})(module.exports);
