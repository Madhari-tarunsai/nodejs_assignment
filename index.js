const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.method === "POST") {
        let inputData = "";

        req.on("data", (chunk) => {
            inputData += chunk.toString();
        });

        req.on("end", () => {
            console.log(inputData);
            fs.readFile("./form.json", "utf8", (err, data) => {
                let existingData = [];

                if (err) {
                    res.write("Error reading file.");
                    res.end();
                } else {
                    if (data.length > 0) {
                        existingData = JSON.parse(data);
                    }

                    let newData = JSON.parse(inputData);
                    let isDuplicate = false;

                    for (let i = 0; i < existingData.length; i++) {
                        if (existingData[i].id === newData.id) {
                            isDuplicate = true;
                        }
                    }

                    if (isDuplicate) {
                        res.write("Duplicate entry, data not added.");
                        res.end();
                    } else {
                        existingData.push(newData);

                        fs.writeFile("./form.json", JSON.stringify(existingData), (err) => {
                            if (err) {
                                res.write("Error writing to file.");
                                res.end();
                            } else {
                                res.write("Data added successfully");
                                res.end();
                            }
                        });
                    }
                }
            });
        });
    }
});

server.listen(3456, () => {
    console.log("Server is running on port 3456");
});
