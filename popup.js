document.getElementById("checkCountry").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: extractAndSendISBN
        });
    });
});

function extractAndSendISBN(){
    let isbnElement = document.getElementById("isbn") || document.querySelector(".isbn");
    let isbn = null;
    
    if(isbnElement){
        isbn = isbnElement.textContent.trim();
    } 
    else{
        const bodyText = document.body.innerText;
        const isbnRegex = /ISBN(?:-13)?:?\\s*([0-9\\-]+)/i;
        const match = bodyText.match(isbnRegex);
        if(match && match[1]){
            isbn = match[1].replace(/-/g, '').trim();
        }
    }

    if(isbn){
        chrome.runtime.sendMessage({ action: "fetchCountry", isbn: isbn });
    }
    else{
        alert("ISBN not found on this page.");
    }
}  