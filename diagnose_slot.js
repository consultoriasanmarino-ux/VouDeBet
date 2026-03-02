const { playSpin } = require('./src/lib/slotEngine');

const config = { rtp_level: 95, payer_mode: false };
const result = playSpin(2.00, {}, config);

console.log('Steps:', result.steps.length);
console.log('Total Win:', result.totalWin);
result.steps.forEach((step, i) => {
    console.log(`Step ${i}: Clusters found:`, step.clusters.length);
});
