// START form submission/adding entries
const form = document.getElementById("entry-form");
const formName = document.getElementById("name-input");
const formEntry = document.getElementById("entry-input");
const submitButton = document.getElementById("entry-submit");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(form);
  let name = formData.get("name") || "unknown";
  let entryContent = formData.get("content");
  let jsonData = JSON.stringify(Object.fromEntries(formData));
  if (JSON.parse(jsonData).name == "") {
    let jsonObj = JSON.parse(jsonData);
    jsonObj.name = "unknown";
    jsonData = JSON.stringify(jsonObj);
  }
  console.log(jsonData);
  fetch("/services/guestbook/submit-entry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonData,
  }).then((response) => {
    if (!response.ok) {
      submitButton.setAttribute("value", "whoops");
      console.error("whoops");
    } else if (response.ok) {
      submitButton.setAttribute("value", "submitted");
    }
  });
  resetSubmitValue();
});
function resetSubmitValue() {
  submitButton.setAttribute("disabled", "disabled");
  setTimeout(() => {
    submitButton.removeAttribute("disabled");
    submitButton.setAttribute("value", "submit");
    location.reload(true);
  }, 500);
}
// END form submission/adding entries

// START entry grabbing

document.addEventListener("DOMContentLoaded", async function () {
  const entryDataUrl = "/services/guestbook/get-entries";
  let entryData;
  let entryCount = 0;
  let currentEntry = 0;
  let entryIds = [];
  try {
    const response = await fetch(entryDataUrl);
    if (!response.ok) {
      entryRetrievalError(response.status, response.statusText);
      throw new Error(`Unable to retrieve entries: ${response.status}`);
    }
    entryData = await response.json();
    console.log(entryData);
  } catch (error) {
    console.error(error.message);
  }
  for (entry in entryData) {
    entryIds.push(entry);
    entryCount++;
  }
  while (currentEntry <= entryCount - 1) {
    currentEntryId = entryIds[currentEntry];
    console.log(currentEntryId);
    currentEntryData = entryData[currentEntryId];
    currentName = currentEntryData["name"];
    currentContent = currentEntryData["content"];
    createWallEntry(currentName, currentContent, currentEntryId);
    currentEntry++;
  }
  console.log(entryIds);
});
function createWallEntry(name, content, entryId) {
  /* shut up */
  let entryContainer = document.createElement("div");
  let entryName = document.createElement("div");
  let entryContent = document.createElement("div");
  const entryWall = document.getElementById("guestbook-wall");
  let wallEntryId = document.createElement("div");
  entryName.innerText = name;
  entryContent.innerText = content;
  wallEntryId.innerText = entryId;
  entryContainer.appendChild(entryName);
  entryContainer.appendChild(entryContent);
  entryContainer.appendChild(wallEntryId);
  entryContainer.setAttribute("class", "guestbook-wall-entry");
  entryName.setAttribute("class", "guestbook-wall-entry-name");
  entryContent.setAttribute("class", "guestbook-wall-entry-content");
  wallEntryId.setAttribute("class", "guestbook-wall-entry-id");
  entryWall.insertBefore(entryContainer, entryWall.firstChild);
}
// END entry grabbing

function entryRetrievalError(errorCode, errorMessage) {
  const entryWall = document.getElementById("guestbook-wall");
  let wallEntry = document.createElement("div");
  let variableMsg = "";
  wallEntry.setAttribute("class", "guestbook-wall-entry-error");
  if (errorCode == 502) {
    variableMsg = "\nthe server used to serve entries may be down.";
  }
  wallEntry.innerText = `unable to retrieve guestbook entries.\n\nerror: ${errorCode} ${errorMessage}.${variableMsg}`;
  entryWall.appendChild(wallEntry);
}
/*
<div class="guestbook-wall-entry">
  <div class="guestbook-wall-entry-name"></div>
  <div class="guestbook-wall-entry-content"></div>
</div>
*/
