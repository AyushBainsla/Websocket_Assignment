const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

let lastUpdate = null;

ws.on('message', (message) => {
    const update = JSON.parse(message);
    if (!isRedundant(update)) {
        logAction(update);
        lastUpdate = update;
    }
});

const isRedundant = (update) => {
    if (!lastUpdate) return false;
    const fields = ['AppOrderID', 'price', 'triggerPrice', 'priceType', 'productType', 'status', 'symbol'];
    return fields.every(field => update[field] === lastUpdate[field]);
};

const logAction = (update) => {
    let action = determineAction(update);
    console.log(`Action: ${action} for ClientID: ${update.AppOrderID}`);
};

const determineAction = (update) => {
    if (update.status === 'cancelled') return 'cancelOrder';
    if (update.status === 'complete') return 'placeOrder';
    if (update.status === 'open') return 'modifyOrder';
    return 'noAction';
};
