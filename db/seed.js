const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db')

const seedData = (dataType) => {
    return new Promise((resolve, reject) => {
        console.log(`Starting ${dataType} seed`)
        const errorIds = [];
        let rowsParsed = 0;
        fs.createReadStream(`./data/${dataType}.csv`)
            .pipe(csv())
            .on('data', (row) => {
                db.addData(dataType, row, (err) => {
                    rowsParsed++;
                    if (err) {
                        console.log(`${dataType} add error @ ${row.id}`)
                        errorIds.push(row.id)
                    }
                });
            })
            .on('end', () => {
                console.log(`${dataType} CSV file successfully processed'`);
                resolve({
                    errorIds,
                    rowsParsed
                })
            })
    })
}



console.log("start seeding process")
seedData("product")
    .then((response) => {
        console.log("Products seeding Complete");
        console.log(JSON.stringify(response))
        // return seedData("features")
    })
    // .then((response) => {
    //     console.log("Features seeding Complete");
    //     console.log(JSON.stringify(response))
    // })