import { h, render, Component } from 'preact';
import style from './style';
import $ from 'jquery';
import Button from '../button';
import style_iphone from '../button/style_iphone';

export default class PlanTripPage extends Component {

  constructor(props) {
    super(props);

    if(typeof this.props.returnFunction !== 'function'){
      this.props.returnFunction = (location) => {
      //make it go to new screen
      console.log("error: return function was not passed, no way to get to home screen");
      }
    }

  }

  handleSubmit = (event) => {
      event.preventDefault();
      var location = this.state.destination;
      var days = this.state.days;
      var units = localStorage.getItem("units");
      var url = "http://api.openweathermap.org/data/2.5/forecast?APPID=0cf17e23b1d108b29a4d738d2084baf5&q=" + location + "&units=" + units;
      $.ajax({
          url: url,
          dataType: "jsonp",
          success: this.displayTrip,
          error: this.invalidLocation
      });
  }

  handleLocChange = (event) => {
      event.preventDefault();
      var dest = event.target.value;
      this.setState({destination: dest});
  }

  handleDayChange = (event) => {
      event.preventDefault();
      var numDays = event.target.value;
      this.setState({days: numDays});
  }

  displayTrip = (parsed_json) => {
      var numResponses = parsed_json['cnt'];

      var i = 0;
      var firstNoon;

      while(i < numResponses) {
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

      var degreeString = (localStorage.getItem("units") == "metric") ? "°C" : "°F";

      var weather0 = [days[0] + ", " + dates[0] + " " + months[0], temps[0] + degreeString, conditions[0]];
      var weather1 = [days[1] + ", " + dates[1] + " " + months[1], temps[1] + degreeString, conditions[1]];
      var weather2 = [days[2] + ", " + dates[2] + " " + months[2], temps[2] + degreeString, conditions[2]];
      var weather3 = [days[3] + ", " + dates[3] + " " + months[3], temps[3] + degreeString, conditions[3]];
      var weather4 = [days[4] + ", " + dates[4] + " " + months[4], temps[4] + degreeString, conditions[4]];

      this.setState({
        weather0: weather0.map((item) => <td class={style.td}>{item}</td>),
        weather1: weather1.map((item) => <td class={style.td}>{item}</td>),
        weather2: weather2.map((item) => <td class={style.td}>{item}</td>),
        weather3: weather3.map((item) => <td class={style.td}>{item}</td>),
        weather4: weather4.map((item) => <td class={style.td}>{item}</td>),
        tripPlanned: true
      });
  }

  invalidLocation = (req, err) => {
      console.log("API call failed " + err);
      this.setState({tripPlanned:false});
  }

  buttonSelection = () => {
      this.props.returnFunction(true, location);
  }

  render() {

    if (this.state.tripPlanned) {
      var tableRows = [];
      var numDays = Number(this.state.days);

      switch(numDays) {
        case 5:
          tableRows.push(
            <tr>{this.state.weather4}</tr>
          );
        case 4:
          tableRows.push(
            <tr>{this.state.weather3}</tr>
          );
        case 3:
          tableRows.push(
            <tr>{this.state.weather2}</tr>
          );
        case 2:
          tableRows.push(
            <tr>{this.state.weather1}</tr>
          );
        case 1:
          tableRows.push(
            <tr>{this.state.weather0}</tr>
          );
      }
    }

    return (
      <div class={ style.planTripWindow }>
        <form onSubmit={this.handleSubmit}>
          <span>PLAN YOUR TRAVEL</span>
          <br />
          <label>
            WHERE TO GO
            <input type="text" name="destination" value={this.state.destination} placeholder="Edinburgh" onChange={this.handleLocChange}/>
          </label>
          <br />
          <label>
            NUMBER OF DAYS TRAVELLING
            <input type="number" min="1" max="5" value={this.state.days} onChange={this.handleDayChange} />
          </label>
          <div class={style.container}>
          <Button class={style.button} text="Submit Trip" clickFunction={this.handleSubmit} />
          <Button class={style.button} text="Go Back Home" clickFunction= {() => {this.props.returnFunction(false);}} />
          </div>
        </form>

        <div>
            <table class ={style.temperature}>
              <tr>
                <th class={style.th}>Date</th>
                <th class={style.th}>Temp</th>
                <th class={style.th}>Conditons</th>
              </tr>
              {tableRows}
            </table>
        </div>

      </div>
    )
  }
}
