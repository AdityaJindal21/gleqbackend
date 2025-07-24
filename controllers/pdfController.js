var {getPDFModal} = require('../models/pdfModal');
var path = require('path');
var pdfRef = getPDFModal();


function doUploadPdf(req, resp) {
    let filename = "nopic.pdf";

    if (req.files && req.files.pdf) {
        const timestamp = Date.now();
        const safeName = req.files.pdf.name.replace(/\s+/g, "_");
        filename = `${timestamp}-${safeName}`;

        const filepath = path.join(__dirname, "..", "uploads", filename);
        req.files.pdf.mv(filepath, (err) => {
            if (err) {
                return resp.json({ status: false, msg: "File save failed", error: err.message });
            }


            const pdfUrl = `http://localhost:2027/uploads/${filename}`;
            req.body.pdf = pdfUrl; 
            const userobj = new pdfRef(req.body);

            userobj.save()
                .then((document) => {
                    resp.json({ doc: document, status: true, msg: 'PDF Uploaded Successfully' });
                })
                .catch((err) => {
                    resp.json({ status: false, msg: err.message });
                });
        });
    } else {
        resp.json({ status: false, msg: "No file uploaded" });
    }
}


async function getUploadedPdfs(req,resp)
{
    const docs = await pdfRef.find({groupId:req.params.groupId});
    resp.json({status:true,doc:docs});
}


//------AI Integration----------------
//OpenAI setUp
const express = require('express');
const fs = require('fs');
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



async function doSummarizepdf(req,res)
{
     try {
    const  pdfId  = req.body._id;
    const pdfDoc = await pdfRef.findById(pdfId);
    if (!pdfDoc) return res.json({ status: false, msg: "PDF not found" });

    const filename = path.basename(pdfDoc.pdf);

    const filePath = path.join(__dirname, "..", "uploads", filename);
    // const filePath = pdfDoc.pdf;
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(dataBuffer);
    const rawText = data.text.slice(0, 3000);

    console.log("Calling the OpenAI API");

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes documents in 10 bullet points."
                },
                {
                    role: "user",
                    content: rawText
                }
            ],
            temperature: 1,
            max_tokens: 1024
            });
    console.log(response); 
    console.log(response.choices[0].message.content); 
    pdfDoc.parsedtext = rawText;
    pdfDoc.summary = response.choices[0].message.content;
    await pdfDoc.save();

    res.json({ status: true, summary: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.json({ status: false, msg: "Something went wrong", error: err.message });
  }
}
async function generatequestion(req, resp) {
  try {
    const pdfId = req.body._id;
    const parsedtext = req.body.parsedtext;

    const pdfDoc = await pdfRef.findById(pdfId);
    if (!pdfDoc) {
      return resp.status(404).json({ status: false, msg: "PDF not found" });
    }

    console.log("Calling the OpenAI API");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "Given the following PDF content, generate 5 quiz questions and their answers. Respond ONLY with a raw JSON array like this: [{ question: '...', answer: '...' }, ...]. Do NOT include markdown formatting or code blocks."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: parsedtext
            }
          ]
        }
      ],
      temperature: 1,
      max_tokens: 1024
    });

    const rawContent = response.choices[0].message.content;

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error("Failed to parse OpenAI JSON:", parseErr);
      return resp.status(400).json({
        status: false,
        msg: "OpenAI returned invalid JSON format",
        error: parseErr.message
      });
    }

    pdfDoc.questions = parsedQuestions;
    await pdfDoc.save();

    return resp.json({ status: true, questions: parsedQuestions });
  } catch (err) {
    console.error("Error generating questions:", err);
    return resp.status(500).json({
      status: false,
      msg: "Something went wrong",
      error: err.message
    });
  }
}





module.exports = {doUploadPdf,getUploadedPdfs, doSummarizepdf,generatequestion};