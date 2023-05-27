

const Airtable = require('airtable');

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: process.env.AIRTABLE_API_KEY
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

module.exports = async (req, res) => {
    const memberId = req.query.memberId;
    
    // Get records from Airtable base
    let records = await base('User_Scenes').select({
        filterByFormula: `{memberID} = "${memberId}"`
    }).firstPage();
    
    res.json(records.map(record => record.fields));
};

