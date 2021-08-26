const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const fetch = require('node-fetch')

app.use(express.json())

require('dotenv').config({ path: path.resolve(__dirname, './.env') })

const api_key = process.env.API_KEY

var encodedData = {
    'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
    'apikey': api_key
};

var formBody = [];

for (var data in encodedData) {
    var encodedKey = encodeURIComponent(data);
    var encodedValue = encodeURIComponent(encodedData[data]);
    formBody.push(encodedKey + "=" + encodedValue);
}

formBody = formBody.join("&");

app.get("/token", async (req, res) => {
    console.log("get the token")
    const url = `https://iam.cloud.ibm.com/identity/token`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formBody
    })
    .then(res => res.text())
    .catch(e => {
        console.error({
            "message": "Error",
            error: e,
        })
        })
    console.log("RESPONSE: ", response)
    res.send(response)
})

var test = {
	"input_data": [
		{
			"fields": [
				"month",
				"dayofweek",
				"borough",
				"min_humidity",
				"max_humidity",
				"min_temp",
				"max_temp",
				"max_wind_speed",
				"weather_description"
			],
			"values": [
				[
					1,
					2,
					3,
					1,
					1,
					1,
					1,
					12,
					13
				]
			]
		}
	]
}

app.post('/test', async (req, res) => {
    console.log("Response: " + req.body.token)
    const AuthToken = req.body.token
    const url = req.body.url
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthToken
        },
        body: JSON.stringify(test)
    })
    .then(res => res.text())
    .catch(e => {
        console.error({
            "message": "Error",
            error: e,
        })
        })
    console.log("RESPONSE: ", response)
    res.send(response)
})

console.log
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

