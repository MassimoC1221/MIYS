/*
  MIYS paper catalogue.
  To add a paper, copy one object and fill in its fields.
  `file` should point to a PDF in the papers/ folder, e.g. "papers/my-paper.pdf".
  Use `file: ""` until a reviewed paper is ready to publish.
*/
const MIYS_PAPERS = [
  {
    id: "sample-proof",
    title: "A first look at mathematical proof",
    authors: ["MIYS Editorial Team"],
    subject: "Exposition",
    year: 2026,
    abstract: "An illustrative catalogue entry demonstrating how MIYS will present mathematical writing. Replace this sample with a real, reviewed student submission before launch.",
    file: "",
    status: "sample"
  },
  {
    id: "sample-number-theory",
    title: "Exploring patterns in integer sequences",
    authors: ["Founding Member (example)"],
    subject: "Number theory",
    year: 2026,
    abstract: "A placeholder for an investigation into integer sequences, conjectures and proof. This is not a real research paper and is included only to demonstrate the layout.",
    file: "",
    status: "sample"
  }
];
