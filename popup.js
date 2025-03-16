document.getElementById("checkCountry").addEventListener("click", () => {
    const button = document.getElementById("checkCountry");
    button.disabled = true;
    button.textContent = "Checking...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if(!tabs || !tabs[0]){
            console.error("No active tab found.");
            button.disabled = false;
            button.textContent = "Check Book Country";
            return;
        }
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: extractAndSendISBN
        }, () => {
            button.disabled = false;
            button.textContent = "Check Book Country";
        });
    });
});

function extractAndSendISBN(){
    const isbnRegex = /ISBN(?:-13)?:?\s*([0-9-]+)/i;
    let isbn = null;

    const isbnElement = document.getElementById("isbn") || document.querySelector(".isbn");
    if(isbnElement){
        const elementText = isbnElement.textContent;
        const match = elementText.match(isbnRegex);
        if(match && match[1]){
            isbn = match[1].replace(/-/g, '').trim();
        }
    }
    
    if (!isbn) {
        const bodyText = document.body.innerText;
        const match = bodyText.match(isbnRegex);
        if (match && match[1]) {
            isbn = match[1].replace(/-/g, '').trim();
        }
    }

    if (isbn) {
        chrome.runtime.sendMessage({ action: "fetchCountry", isbn: isbn });
    } else {
        alert("ISBN not found on this page.");
    }
}
