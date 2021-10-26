import { h, render, Component } from 'preact';
import $ from 'jquery'; //getting data from API

import style from './style';

export default class FiveDayForecast extends Component
{

  constructor(props)
  {
    super(props);
    // if not typed in a certain locaiton, it will automatically enter your current location
    if(!this.props.location)
    {
      this.props.location = localStorage.getItem("location");
    }

    if(!this.props.units)
    {
      this.props.units = localStorage.getItem("units");
    }

    this.setState({
      location: this.props.location,
      units: this.props.units
    });

    this.fetchForecast();
    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      location: nextProps.location,
      units: nextProps.units
    });
    this.fetchForecast();
  }

  // making a call, if sucessfull, it will proceed to this body
  fetchForecast()
  {
    var url = "http://api.openweathermap.org/data/2.5/forecast?APPID=0cf17e23b1d108b29a4d738d2084baf5&q=" + this.state.location + "&units=" + this.state.units;
    
    $.ajax({
			url: url,
      dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
    })

    
  }

  parseResponse = (parsed_json) => 
  {
    
    var numResponses = parsed_json['cnt'];
    
    var i = 0;
    var firstNoon;
    // find the next noon forecast
    while(i < numResponses) {
        // console.log("Time: " + parsed_json['list'][i]['dt_txt'].substring(11));
        if(parsed_json['list'][i]["dt_txt"].substring(11) === "12:00:00") {
            firstNoon = i;
            break;
        }
        i++;
    }
    
    i = firstNoon;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    var temps = [];
    var conditions = [];
    var months = [];
    var dates = [];
    var days = [];
    // for the next 5 days at noon, extract date and weather info
    var limit = 32 + i;
    while(i <= limit) {
      var currTemp = parsed_json['list'][i]['main']['temp'];
      var currCond = parsed_json['list'][i]['weather'][0]['description'];
      var date = new Date(parsed_json['list'][i]['dt_txt']);
      var currMonth = monthsAbbr[date.getMonth()];
      var currDate = date.getDate();
      var currDay = daysOfWeek[date.getDay()];
      temps.push(currTemp);
      conditions.push(currCond);
      months.push(currMonth);
      dates.push(currDate);
      days.push(currDay);
      i += 8;
    }

    var degreeString = (this.state.units == "metric") ? "°C" : "°F";
    // create arrays for each day. The array is in the format [date, temperature, conditions]
    var weather0 = [days[0] + ", " + dates[0] + " " + months[0], temps[0] + degreeString, conditions[0]];
    var weather1 = [days[1] + ", " + dates[1] + " " + months[1], temps[1] + degreeString, conditions[1]];
    var weather2 = [days[2] + ", " + dates[2] + " " + months[2], temps[2] + degreeString, conditions[2]];
    var weather3 = [days[3] + ", " + dates[3] + " " + months[3], temps[3] + degreeString, conditions[3]];
    var weather4 = [days[4] + ", " + dates[4] + " " + months[4], temps[4] + degreeString, conditions[4]];

    // map the weather for each day to a table element that can be rendered
    this.setState({
      weather0: weather0.map((item) => <td class={style.td_red}>{item}</td>),
      weather1: weather1.map((item) => <td class={style.td_blue}>{item}</td>),
      weather2: weather2.map((item) => <td class={style.td_orange}>{item}</td>),
      weather3: weather3.map((item) => <td class={style.td_magenta}>{item}</td>),
      weather4: weather4.map((item) => <td class={style.td_green}>{item}</td>),

    });

    
  }

  render()
  {
    return(
        <div>
            <table class={style.temperature}>
              <tr>
                <th class={style.th}>Date</th>
                <th class={style.th}>Temp</th>
                <th class={style.th}>Conditons</th>
              </tr>
              <tr>
                {this.state.weather0}
              </tr>
              <tr>
                {this.state.weather1}
              </tr>
              <tr>
                {this.state.weather2}
              </tr>
              <tr>
                {this.state.weather3}
              </tr>
              <tr>
                {this.state.weather4}
              </tr>
            </table>
            

            
        </div>
    );
  }
}
