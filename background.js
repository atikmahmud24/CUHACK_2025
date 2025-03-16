chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if(request.action === "fetchCountry"){
        const isbn = request.isbn;
        const apiKey = "AIzaSyDbWNw_9Rbsg7RK9V_wa3RtFOhmnW9kLU0";
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const promptText = `Given this ISBN number: "${isbn}", identify the country of origin for the book (for example, where it was published or the author's country).`;
        
        fetch(endpoint,{
            method: "POST",
            headers:{
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: {
                contents: [promptText]
                }
            })
        })
        .then(response => response.json())
        .then(data =>{
        const country = data?.candidates?.[0]?.content || "Unknown";
        chrome.tabs.sendMessage(sender.tab.id, { action: "displayCountry", country: country });
        })
        .catch(error =>{
        console.error("Error fetching country:", error);
        chrome.tabs.sendMessage(sender.tab.id, { action: "displayCountry", country: "Error fetching data" });
        });
    }
});
  