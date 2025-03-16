document.getElementById("checkOrigin").addEventListener("click", () =>{
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>{
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: extractAndSendProductInfo
      });
    });
});
  
function extractAndSendProductInfo(){
    const titleElement = document.getElementById("productTitle");
    if(titleElement){
      const productTitle = titleElement.textContent.trim();
      chrome.runtime.sendMessage({ action: "fetchOrigin", productTitle: productTitle });
    } 
    else{
      alert("Product title not found on this page.");
    }
}  