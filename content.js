function extractProductTitle(){
    const titleElement = document.getElementById("productTitle");
    return titleElement ? titleElement.textContent.trim():null;
}

const productTitle = extractProductTitle();
if(productTitle){
    chrome.runtime.sendMessage({ action: "fetchOrigin", productTitle: productTitle });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if(request.action === "displayOrigin"){
        const origin = request.origin;

        let infoDiv = document.createElement("div");
        infoDiv.style.position = "fixed";
        infoDiv.style.bottom = "20px";
        infoDiv.style.right = "20px";
        infoDiv.style.backgroundColor = "#fff";
        infoDiv.style.border = "1px solid #ccc";
        infoDiv.style.padding = "10px";
        infoDiv.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        infoDiv.style.zIndex = 9999;
        infoDiv.innerText = "Country of Origin: " + origin;
        document.body.appendChild(infoDiv);
    }
});  