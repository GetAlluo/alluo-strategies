const { SolidityMetricsContainer } = require('solidity-code-metrics');
const fs = require('fs');
const path = require('path');


function enumerateFiles(dir) {
    const fileList = [];
    const queue = [dir];

    while (queue.length > 0) {
        const currentDir = queue.shift();
        const files = fs.readdirSync(currentDir);

        files.forEach((file) => {
            const filePath = path.join(currentDir, file);
            const fileStat = fs.lstatSync(filePath);

            if (fileStat.isDirectory()) {
                queue.push(filePath);
            } else {
                fileList.push(filePath);
            }
        });
    }

    return fileList;
}

function saveStringToFile(filePath, str) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath);
    }
    fs.writeFileSync(filePath, str);
}

function isExcluded(path) {
    for (let i = 0; i < excludePaths.length; i++) {
        if (path.startsWith(excludePaths[i])) {
            return true;
        }        
    }
    return false;
}

let options = {
    basePath: "",
    inputFileGlobExclusions: undefined,
    inputFileGlob: undefined,
    inputFileGlobLimit: undefined,
    debug: false,
    repoInfo: {
        branch: undefined,
        commit: undefined,
        remote: undefined
    }
}

const basePath = "contracts";

let excludePaths = [
    `${basePath}\\deprecated`
];

let metrics = new SolidityMetricsContainer("GetAlluo/investment-strategies", options);
let allFiles = enumerateFiles(basePath);

for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    if (isExcluded(file)) {
        continue;
    }

    console.log(`Analyzing '${file}'...`);
    metrics.analyze(file);
}

console.log("Generating report...");
metrics.generateReportMarkdown().then((text) => {
    saveStringToFile("solidity-metrics-report.md", text);
    console.log("Report saved in ./solidity-metrics-report.md");
});