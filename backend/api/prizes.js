// api/prizes.js
const { DateTime } = require('luxon');
let prizeData = [];
let nextUpdateTime = DateTime.now().plus({ days: 1 }).toISO(); // Update in 24 hours

function generatePrizes() {
    const numBoxes = 500;
    const prizes = [];
    const counts = {
        0: Math.floor(numBoxes * 0.50),
        1: Math.floor(numBoxes * 0.20),
        21: Math.floor(numBoxes * 0.20),
        31: Math.floor(numBoxes * 0.05),
        51: Math.floor(numBoxes * 0.04),
        101: Math.floor(numBoxes * 0.01)
    };

    const prizeValues = [
        ...Array(counts[0]).fill(0),
        ...Array(counts[1]).fill().map(() => Math.floor(Math.random() * 21)),
        ...Array(counts[21]).fill().map(() => Math.floor(Math.random() * 11) + 20),
        ...Array(counts[31]).fill().map(() => Math.floor(Math.random() * 21) + 30),
        ...Array(counts[51]).fill().map(() => Math.floor(Math.random() * 51) + 50),
        ...Array(counts[101]).fill().map(() => Math.floor(Math.random() * 401) + 100),
        500
    ];

    for (let i = prizeValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [prizeValues[i], prizeValues[j]] = [prizeValues[j], prizeValues[i]];
    }

    return prizeValues;
}

export default function handler(req, res) {
    const now = DateTime.now().toISO();
    
    if (!prizeData.length || DateTime.fromISO(nextUpdateTime) <= DateTime.fromISO(now)) {
        prizeData = generatePrizes();
        nextUpdateTime = DateTime.now().plus({ days: 1 }).toISO();
    }

    res.status(200).json({ prizes: prizeData, nextUpdateTime });
}
