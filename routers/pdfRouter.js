var express = require('express');
var PdfRouter = express.Router();

var obj = require('../controllers/pdfController');

PdfRouter.post('/upload',obj.doUploadPdf);
PdfRouter.get('/group/:groupId',obj.getUploadedPdfs);
PdfRouter.post('/summarize',obj.doSummarizepdf);
PdfRouter.post('/generatequestion',obj.generatequestion)


module.exports = PdfRouter;
