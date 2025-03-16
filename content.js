function extractISBN(){
    let isbnElement = document.getElementById("isbn")|| document.querySelector(".isbn");
    if(isbnElement){
        return isbnElement.textContent.trim();
    }
    const bodyText = document.body.innerText;
    const isbnRegex = /ISBN(?:-13)?:?\\s*([0-9\\-]+)/i;//splits
    const match = bodyText.match(isbnRegex);

    if(match && match[1]){
        return match[1].replace(/-/g, '').trim();
    }
    return null;
}
  
const isbn = extractISBN();
if(isbn){
    chrome.runtime.sendMessage({ action: "fetchCountry", isbn: isbn });
}
  
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "displayCountry"){
        const country = request.country;
        let infoDiv = document.createElement("div");
        infoDiv.style.position = "fixed";
        infoDiv.style.bottom = "20px";
        infoDiv.style.right = "20px";
        infoDiv.style.backgroundColor = "#fff";
        infoDiv.style.border = "1px solid #ccc";
        infoDiv.style.padding = "10px";
        infoDiv.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        infoDiv.style.zIndex = 9999;
        infoDiv.innerText = "Book Country of Origin: " + country;
        document.body.appendChild(infoDiv);
    }
});
  