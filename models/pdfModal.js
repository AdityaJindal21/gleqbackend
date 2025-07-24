const mongoose = require('mongoose');

function getPDFModal() {
    const PdfSchema = mongoose.Schema;

    const userPdfSchema = {
        title: { type: String, required: true },
        pdf: { type: String, required: true },
        uploadedBy: { type: String, required: true },
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: "StudyPod", required: true },
        parsedtext :{type:String, default: ""},
        summary: { type: String, default: "" },
        questions: [
  {
    question: String,
    answer: String
  }
],
        createdAt: { type: Date, default: Date.now }
    };

    const options = {
        versionKey: false
    };

    const UserPDFSchema = new PdfSchema(userPdfSchema, options);

    const pdfRef = mongoose.model("UserPDF", UserPDFSchema);
    return pdfRef;
}

module.exports = { getPDFModal };
