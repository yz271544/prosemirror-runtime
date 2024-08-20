import express from 'express';
const app = express();
const port = 3000;
const getSum = (limit) => {
    let sum = 0;
    for (let i = 0; i < limit; i++) {
        sum += i;
    }
    return sum;
};
app.get("/", (req, res) => {
    const result = getSum(1500);
    res.setHeader('Cache-Control', 'no-store');
    res.send(`Processed function getSum on main thread and result: ${result}`);
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=server1.js.map