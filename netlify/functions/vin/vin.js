const { AIRTABLE_API_KEY } = process.env
var Airtable = require('airtable');
var base = new Airtable({apiKey: AIRTABLE_API_KEY}).base('appmHi23sAHSWIVk5');


const handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters

      const records = await new Promise(async (resolve, reject) => {
        base('vin').select({
          // Selecting the first 3 records in Grid view:
          maxRecords: 50,
          view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
            console.log(records)
              resolve({
                statusCode: 200,
                body: JSON.stringify(records)
              });
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
        
        }, function done(err) {
            if (err) { console.error(err); return; }
        });
      });

      return records
    } else if (event.httpMethod === 'POST') {
      const fields = JSON.parse(event.body)
      const records = await new Promise(resolve => base('vin').create([
        {
          "fields": fields
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        resolve(records);
      }))

      return {
        statusCode: 200,
        body: JSON.stringify(records)
      }
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
