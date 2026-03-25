const fs = require('fs');

async function testApi() {
    console.log("Generating large payload...");
    const payload = {
        initiative: {
            id: 18,
            title: "Test Timeout",
            subInitiatives: Array(10).fill({
                id: "sub",
                title: "Test Phase",
                description: "Test",
                budget: 100,
                timeline: "Q1",
                category: "Social",
                priority: "Media",
                imageUrl: "data:image/jpeg;base64," + "A".repeat(300000) // 300KB string * 10 = 3MB array
            })
        },
        lastUpdated: "Hoy"
    };

    console.log("Payload size:", JSON.stringify(payload).length);
    console.log("Sending to http://localhost:3001/api/initiatives/18 ...");
    
    const start = Date.now();
    try {
        const res = await fetch('http://localhost:3001/api/initiatives/18', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        console.log(`Response status: ${res.status}`);
        console.log(`Response body: ${text}`);
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
    console.log(`Time taken: ${Date.now() - start}ms`);
}

testApi();
