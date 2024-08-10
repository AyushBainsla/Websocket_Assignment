const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');
    let updateCount = 0;

    const sendUpdates = () => {
        let update;
        if (updateCount < 10) {
            update = generateUpdate(1);
        } else if (updateCount < 30) {
            update = generateUpdate(2);
        } else if (updateCount < 70) {
            update = generateUpdate(3);
        } else if (updateCount < 100) {
            update = generateUpdate(4);
        }

        if (update) {
            logUpdate(update); // Log the update before sending it
            ws.send(JSON.stringify(update));
        }

        updateCount++;
        if (updateCount < 100) {
            setTimeout(sendUpdates, getTimeout(updateCount));
        }
    };

    sendUpdates();

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const generateUpdate = (interval) => {
    return {
        AppOrderID: Math.floor(Math.random() * 1000000000),
        price: Math.floor(Math.random() * 100),
        triggerPrice: Math.floor(Math.random() * 100),
        priceType: interval % 2 === 0 ? 'MKT' : 'LMT',
        productType: 'I',
        status: ['open', 'complete', 'cancelled'][Math.floor(Math.random() * 3)],
        CumulativeQuantity: 0,
        LeavesQuantity: 1,
        OrderGeneratedDateTimeAPI: new Date().toISOString(),
        transaction: ['buy', 'sell'][Math.floor(Math.random() * 2)],
        AlgoID: "",
        exchange: 'NSE',
        symbol: ['RELIANCE', 'TATA', 'BAJAJ', 'WIPRO'][Math.floor(Math.random() * 4)]
    };
};

const logUpdate = (update) => {
    console.log(`Update sent to order book at ${new Date().toISOString()} for ClientID ${update.AppOrderID}:`, update);
};

console.log(`WebSocket Server is running on port ${wss.options.port}`);

const getTimeout = (count) => {
    if (count < 10) return 1000; // 1 second
    if (count < 30) return 2000; // 2 seconds
    if (count < 70) return 3000; // 3 seconds
    return 5000; // 5 seconds
};
