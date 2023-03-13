const removeBtn = document.getElementById("remove-btn");
const opmlUpload = document.getElementById("opml-upload");
const opmlInput = document.getElementById("opml");
const downloadBtn = document.getElementById("download-btn");

removeBtn.addEventListener("click", () => {
  const titlesInput = document.getElementById("titles");
  const titles = titlesInput.value
    .trim()
    .split("\n")
    .map((title) => title.trim());
  if (titles.length === 0) {
    alert("Please enter at least one title.");
    return;
  }

  if (opmlInput.value.trim() === "") {
    alert(
      "Please select an OPML file to upload or paste an OPML file in the text area."
    );
    return;
  }

  let opmlDoc;
  try {
    const parser = new DOMParser();
    opmlDoc = parser.parseFromString(opmlInput.value, "text/xml");
  } catch (e) {
    alert(
      "Invalid OPML file format. Please check that the file is well-formed XML."
    );
    return;
  }

  const outlines = Array.from(opmlDoc.querySelectorAll("outline"));
  if (outlines.length === 0) {
    alert("The OPML file does not contain any <outline> tags.");
    return;
  }

  outlines.forEach((outline) => {
    const title = outline.getAttribute("text");
    if (!titles.includes(title)) {
      outline.remove();
    }
  });

  const serializer = new XMLSerializer();
  const opmlString = serializer
    .serializeToString(opmlDoc)
    .trim()
    .replace(/\s{2,}/g, "\n");
  opmlInput.value = opmlString;
  downloadBtn.href = URL.createObjectURL(
    new Blob([opmlString], { type: "application/xml" })
  );
  downloadBtn.download = "trimmed_subscriptions.opml";
  downloadBtn.style.display = "inline-block";
});

opmlUpload.addEventListener("change", () => {
  const fileReader = new FileReader();
  fileReader.readAsText(opmlUpload.files[0], "UTF-8");
  fileReader.onload = (evt) => {
    opmlInput.value = evt.target.result;
  };
});
