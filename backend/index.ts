import express from "express";
const app = express();
const port = 8080;

app.get("/test", (req: any, res: any) => {
    res.send("test success");
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});