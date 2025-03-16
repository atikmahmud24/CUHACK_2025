chrome.runtime.onMessage.addListener((request) => {
    if(request.action === "displayCountry") {
        const infoDiv = document.createElement("div");
        infoDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            max-width: 350px;
            font-family: Arial, sans-serif;
        `;

        if(request.error){
            infoDiv.innerHTML = `<div style="color: red;">Error: ${request.error}</div>`;
        }
        else if(request.data){
            const d = request.data;
            infoDiv.innerHTML = `
                <h3 style="margin: 0 0 15px; color: #2b2b2b;">📖 ${d.title}</h3>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                        <span style="font-weight: bold; min-width: 80px;">Author:</span>
                        <span>${d.author} ${d.author_nationality || ''}</span>
                    </div>
                    
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <span style="font-weight: bold; min-width: 80px;">Publisher:</span>
                        <span>${d.publisher} ${d.publisher_country || ''}</span>
                    </div>
                </div>

                ${d.recommendations ? `
                <div style="border-top: 1px solid #eee; padding-top: 15px;">
                    <h4 style="margin: 0 0 12px; color: #2b2b2b;">Recommended Similar Books</h4>
                    ${d.recommendations.map(book => `
                        <div style="margin-bottom: 10px; padding: 10px; background: #f8f8f8; border-radius: 5px;">
                            <div style="font-weight: 500;">${book.title}</div>
                            <div style="color: #666; font-size: 0.9em;">
                                ${book.author} · ${book.year || ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            `;
        }

        const oldDiv = document.getElementById("book-info");
        if(oldDiv) oldDiv.remove();
        
        infoDiv.id = "book-info";
        document.body.appendChild(infoDiv);
    }
});