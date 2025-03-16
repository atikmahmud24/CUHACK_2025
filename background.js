chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if(request.action === "fetchOrigin"){
        const productTitle = request.productTitle;

        const apiKey = "AIzaSyDbWNw_9Rbsg7RK9V_wa3RtFOhmnW9kLU0";
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const promptText = `Given this product description: "${productTitle}", identify the country of origin.`;

        fetch(endpoint,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt:{
            contents: [promptText]
            }
        })
        })
        .then(response => response.json())
        .then(data =>{
            const origin = data?.candidates?.[0]?.content || "Unknown";

            chrome.tabs.sendMessage(sender.tab.id, {
            action: "displayOrigin",
            origin: origin
            });
        })
        .catch(error =>{
            console.error("Error fetching origin:", error);
            chrome.tabs.sendMessage(sender.tab.id, {
            action: "displayOrigin",
            origin: "Error fetching data"
            });
        });
    }
});  