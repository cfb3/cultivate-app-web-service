const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express')
const router = express.Router()
require('dotenv').config()

async function getCurrentWeather() {
    const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=47.11&lon=-122.11&cnt=10&units=imperial&appid=' + process.env.WEATHER_API_KEY
    const request = await fetch(WEATHER_API_URL);
    const data = request.json();
    return data;
}

/**
 * @api {get} /currentWeather Request for current weather info
 * @apiName GetCurrentWeather
 * @apiGroup Weather
 */ 
router.get('/', async (request, response) => {

    getCurrentWeather()
        .then((weather) => {
            //Retrieve temp and conditions
            const result = 
                {
                    temperature: weather.main.temp, //Temperature
                    conditions: weather.weather[0].main //Conditions
                }

            console.log(result);
            response.json(result);
        })
        .catch((error) => {
            console.error(error);
            response.status(400).json({
                msg:"Could not retrieve current weather info",
                error
            })
        });
})
module.exports = router