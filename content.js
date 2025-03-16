chrome.runtime.onMessage.addListener((request) => {
    if(request.action === "displayCountry") {
        const infoDiv = document.createElement("div");
        infoDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            max-width: 300px;
        `;

        if(request.error) {
            infoDiv.innerHTML = `<div style="color: red;">Error: ${request.error}</div>`;
        } else if(request.data) {
            const { author, publisher } = request.data;
            infoDiv.innerHTML = `
                <h3>Book Details</h3>
                <p><strong>Author:</strong> ${author.full_name}</p>
                <p><strong>Nationality:</strong> ${author.nationalities.map(n => n.flag + ' ' + n.country).join(', ')}</p>
                <p><strong>Publisher:</strong> ${publisher.name}</p>
                <p><strong>Location:</strong> ${publisher.countries.map(c => c.flag + ' ' + c.country).join(', ')}</p>
            `;
        } else {
            infoDiv.innerHTML = `<div style="color: red;">No data received</div>`;
        }

        // Remove existing div if present
        const oldDiv = document.getElementById("book-info");
        if(oldDiv) oldDiv.remove();
        
        infoDiv.id = "book-info";
        document.body.appendChild(infoDiv);
    }
});