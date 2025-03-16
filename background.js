chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "fetchCountry"){
        const isbn = request.isbn;
        console.log('Processing ISBN:', isbn);

        const googleBooksEndpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

        fetch(googleBooksEndpoint)
            .then(response => response.json())
            .then(googleData => {
                if(!googleData.items || googleData.items.length === 0){
                    throw new Error('No Google Books data found');
                }

                const volumeInfo = googleData.items[0].volumeInfo;
                const baseData = {
                    author: volumeInfo.authors?.[0] || 'Unknown Author',
                    publisher: volumeInfo.publisher || 'Unknown Publisher',
                    title: volumeInfo.title,
                    publishedDate: volumeInfo.publishedDate
                };

                console.log('Base data from Google:', baseData);

                const geminiPrompt = `Given this book information:
    - Author: ${baseData.author}
    - Publisher: ${baseData.publisher}

Provide:
1. Author's nationality with flag emoji (use Wikidata/Wikipedia)
2. Publisher's headquarters country with flag emoji
3. Three similar genre books that must be Canadian (title, author, year)

Format as JSON:
{
    "author_nationality": "Country 🇺🇳",
    "publisher_country": "Country 🇺🇳",
    "recommendations": [
        {"title": "...", "author": "...", "year": "..."}
    ]
}`;

                return fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDbWNw_9Rbsg7RK9V_wa3RtFOhmnW9kLU0`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        contents: [{
                            parts: [{text: geminiPrompt}]
                        }]
                    })
                })
                .then(res => res.json())
                .then(geminiData => {
                    const geminiText = geminiData.candidates[0].content.parts[0].text;
                    const geminiJson = JSON.parse(geminiText.replace(/```json|```/g, ''));
                    return {...baseData, ...geminiJson};
                });
            })
            .then(finalData => {
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "displayCountry",
                    data: finalData
                });
            })
            .catch(error => {
                console.error('Error:', error);
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "displayCountry",
                    error: error.message
                });
            });

        return true;
    }
});