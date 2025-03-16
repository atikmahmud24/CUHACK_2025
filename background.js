chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if(request.action === "fetchCountry"){
        const isbn = request.isbn;
        const apiKey = "AIzaSyDbWNw_9Rbsg7RK9V_wa3RtFOhmnW9kLU0";
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const promptText = `Given the ISBN "${isbn}", please perform the following steps using this website "https://isbnsearch.org/":
        1. Paste the ISBN into the designated website
        2. Look for the author and the publisher on the website and list them
        3. Identify the author of the book and determine the country or countries of the author's origin. If the author has multiple nationalities, list each one, appending the corresponding flag emoji.
        4. Identify the country or countries of the publisher, also appending the corresponding flag emoji to each.
        5. Return only the following details:
            - The author's nationality(ies) with emoji,
            - The publisher's country(ies) with emoji,`;
        
        fetch(endpoint,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: promptText
                  }]
                }]
            })
        })          
        .then(response => response.json())
        .then(data =>{
            console.log('API response:', data);
            const country = data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Unknown";
            chrome.tabs.sendMessage(sender.tab.id, { action: "displayCountry", country: country });
            chrome.tabs.sendMessage(sender.tab.id, { action: "displayCountry", country: country });
        })
        .catch(error =>{
            console.error("Error fetching country:", error);
            chrome.tabs.sendMessage(sender.tab.id, { action: "displayCountry", country: "Error fetching data" });
        });
    }
});