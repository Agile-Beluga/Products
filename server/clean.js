const csv = require('csv-parser');
const fs = require('fs');

const read = (dataType) => {
    console.log(`Starting ${dataType} seed`)
    let rowsParsed = 0;
    fs.createReadStream('../db/csv-files/photos.csv')
        .pipe(csv())
        .on('data', (row) => {
            rowsParsed++;
            if (rowsParsed === 48) {
                console.log(row)
            }
        })
        .on('end', () => {
            console.log(`${dataType} CSV file successfully processed'`);

        })
}

read("photos")