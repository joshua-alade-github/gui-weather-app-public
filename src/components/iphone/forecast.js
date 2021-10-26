import { h, render, Component } from 'preact';
export default class forecast extends Component {

					  "location":
						{
					    "name": "Seven Trees",
					    "region": "California",
					    "country": "United States of America",
					    "lat": ??.??,
					    "lon": -???.??,
					    "tz_id": "America/Los_Angeles",
					    "localtime_epoch": 1537119425,
					    "localtime": "2018-09-16 10:37"
					  },

					  "current": {
					    "last_updated_epoch": 1537119006,
					    "last_updated": "2018-09-16 10:30",
					    "temp_c": 18,
					    "temp_f": 64.4,
					    "is_day": 1,
					    "condition": {
					      "text": "Sunny",
					      "icon": "//cdn.apixu.com/weather/64x64/day/113.png",
					      "code": 1000
					    },
					    "wind_mph": 0,
					    "wind_kph": 0,
					    "wind_degree": 0,
					    "wind_dir": "N",
					    "pressure_mb": 1016,
					    "pressure_in": 30.5,
					    "precip_mm": 0,
					    "precip_in": 0,
					    "humidity": 60,
					    "cloud": 0,
					    "feelslike_c": 18,
					    "feelslike_f": 64.4,
					    "vis_km": 16,
					    "vis_miles": 9
					  },
					  "forecast": {
					    "forecastday": [
					      {
					        "date": "2018-09-16",
					        "date_epoch": 1537056000,
					        "day": {
					          "maxtemp_c": 22.2,
					          "maxtemp_f": 72,
					          "mintemp_c": 12.2,
					          "mintemp_f": 54,
					          "avgtemp_c": 15.8,
					          "avgtemp_f": 60.5,
					          "maxwind_mph": 13,
					          "maxwind_kph": 20.9,
					          "totalprecip_mm": 0,
					          "totalprecip_in": 0,
					          "avgvis_km": 20,
					          "avgvis_miles": 12,
					          "avghumidity": 65,
					          "condition": {
					            "text": "Sunny",
					            "icon": "//cdn.apixu.com/weather/64x64/day/113.png",
					            "code": 1000
					          },
					          "uv": 7.5
					        },
					        "astro": {
					          "sunrise": "06:50 AM",
					          "sunset": "07:13 PM",
					          "moonrise": "01:58 PM",
					          "moonset": "No moonset"
					        }
					      }
					    ]
					  }
					}
