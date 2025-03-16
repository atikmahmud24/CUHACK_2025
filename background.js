chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchCountry") {
        const isbn = request.isbn.trim();
        console.log('Received ISBN:', isbn);
        if (!isbn) {
            chrome.tabs.sendMessage(sender.tab.id, {
                action: "displayCountry",
                error: "No ISBN provided."
            });
            return;
        }

        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const googleBooksEndpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;

        fetch(googleBooksEndpoint)
            .then(response => response.json())
            .then(data => {
                console.log('Google Books API raw response:', data);
                if (data.totalItems > 0 && data.items && data.items.length > 0) {
                    const volumeInfo = data.items[0].volumeInfo;
                    const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : "Unknown";
                    const publisher = volumeInfo.publisher || "Unknown";
                    const result = {
                        metadata: {
                            isbn: isbn,
                            sources_used: ["Google Books"]
                        },
                        author: {
                            full_name: author,
                            nationalities: []
                        },
                        publisher: {
                            name: publisher,
                            countries: []
                        },
                        disclaimer: `Data verified against Google Books as of ${currentDate}`
                    };
                    
                    chrome.tabs.sendMessage(sender.tab.id, {
                        action: "displayCountry",
                        data: result
                    });
                } else {
                    console.log('Google Books returned no items, falling back to OpenLibrary');
                    const openLibraryEndpoint = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
                    
                    fetch(openLibraryEndpoint)
                        .then(response => response.json())
                        .then(openLibData => {
                            console.log('OpenLibrary API raw response:', openLibData);
                            const key = `ISBN:${isbn}`;
                            if (openLibData && openLibData[key]) {
                                const bookData = openLibData[key];
                                const author = bookData.authors && bookData.authors.length > 0 ? 
                                    bookData.authors.map(a => a.name).join(', ') : "Unknown";
                                const publisher = bookData.publishers && bookData.publishers.length > 0 ? 
                                    bookData.publishers.map(p => p.name).join(', ') : "Unknown";
                                const result = {
                                    metadata: {
                                        isbn: isbn,
                                        sources_used: ["OpenLibrary"]
                                    },
                                    author: {
                                        full_name: author,
                                        nationalities: []
                                    },
                                    publisher: {
                                        name: publisher,
                                        countries: []
                                    },
                                    disclaimer: `Data verified against OpenLibrary as of ${currentDate}`
                                };
                                
                                chrome.tabs.sendMessage(sender.tab.id, {
                                    action: "displayCountry",
                                    data: result
                                });
                            } else {
                                chrome.tabs.sendMessage(sender.tab.id, {
                                    action: "displayCountry",
                                    error: "Invalid ISBN or no data found from both Google Books and OpenLibrary."
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching data from OpenLibrary:', error);
                            chrome.tabs.sendMessage(sender.tab.id, {
                                action: "displayCountry",
                                error: `Error fetching data from OpenLibrary: ${error.message}`
                            });
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching data from Google Books:', error);
                chrome.tabs.sendMessage(sender.tab.id, {
                    action: "displayCountry",
                    error: `Error fetching data from Google Books: ${error.message}`
                });
            });
            
        return true;
    }
});