// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
import style_iphonePTB from '../planTripButton/style_iphonePTB';
import style_unit from '../unitButton/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';
import PlanTripButton from '../planTripButton';
import PlanTripPage from '../planTripPage';
import UnitButton from '../unitButton';
import SetLocationPage from '../setLocationPage';
import FiveDayForecast from '../fiveDayForecast';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ display: true });


		// get last location or start at default
		var location = localStorage.getItem("location");
		if(location) {
			this.setState({location: location});
		}
		else {
			localStorage.setItem("location", "London,UK");
			this.setState({location: "London,UK"});
		}

		// get last units or start at default
		var units = localStorage.getItem("units");
		if(units) {
			this.setState({units: units});
		}
		else {
			localStorage.setItem("units", "metric");
			this.setState({"units" : "metric"});
		}
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		//var current_location = "London,uk";


		// API URL with a structure of : http://api.wunderground.com/api/key/feature/q/country-code/city.json
		//var url = "http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=5e5c9339daf11b8a667cfb44fa53a349";
		// old key: 5e5c9339daf11b8a667cfb44fa53a349
		// new key: 6cb2a52bb77a7c60fde88c2a1c7e4371
		// prof key: 0cf17e23b1d108b29a4d738d2084baf5
		var url = "http://api.openweathermap.org/data/2.5/weather?APPID=0cf17e23b1d108b29a4d738d2084baf5&q=" + this.state.location + "&units=" + this.state.units;
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}
	// a call to go to plan trip screen
	showPlanTripPage = () => {
		this.setState({
			locate: false,
			temp: false,
			cond: false,
			planTripButton: false,
			planTrip: <PlanTripPage returnFunction = { this.goBackPlanTrip }/>,
			unitButton: false,
			locationButton: false,
			fiveDayForecast: false,
			refreshButton: false
		});
	}

  // a call to go back to home from plan trip Page
	goBackPlanTrip = () => {
		this.setState({
			planTrip: false,
		});
		this.fetchWeatherData();
	}

	// a function to change the units displayed
	swapUnits = () => {
		if(this.state.units === "metric") {
			this.setState({units: "imperial"});
			localStorage.setItem("units", "imperial");
		}
		else {
			this.setState({units: "metric"});
			localStorage.setItem("units", "metric");
		}
		console.log("Units is now " + this.state.units);
		this.fetchWeatherData();
	}

	// a function to go to the location setting page
	showSetLocationPage = () => {
		this.setState({
			locate: false,
			temp: false,
			cond: false,
			planTripButton: false,
			planTrip: false,
			unitButton: false,
			locationButton: false,
			refreshButton: false,
			fiveDayForecast: false,
			setLocation: <SetLocationPage returnFunction={this.updateLocation}/>
		});
	}

	// a function that is passed to the location changer so it can return to home and update location
	updateLocation = (success, newLocation) => {
		//console.log("Called updateLocation in main screen");
		if(success) {
			this.setState({
				location: newLocation
			});
			localStorage.setItem("location", newLocation);
		}

		this.setState({setLocation: false});
		this.fetchWeatherData();
	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		var unitStyle = this.state.units === "metric" ? `${style.filledC}` : `${style.filledF}`;
		const tempStyles = this.state.temp ? `${style.temperature} ${unitStyle}` : style.temperature;


		// display all weather data
		return (

			<div class={ style.container }>
				<div class={ style.header }>
					<div style="width:100%; display:table;">
						<div style="display: table-row;">
							<div style="display:table-cell;" class={style_iphone.container}>{this.state.locationButton}</div>
							<div style="display:table-cell;" class={ style_iphonePTB.container }>
							{ this.state.planTripButton }
							</div>
							<div style="display:table-cell;" class={style_unit.container}>{this.state.unitButton}</div>
						</div>
					</div>
					<div>{ this.state.planTrip }</div>
					<div>{ this.state.setLocation }</div>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={ tempStyles }>{ this.state.temp }</span>
					<div>{this.state.fiveDayForecast}</div>
					<div class={style_iphone.container}>{this.state.refreshButton}</div>
				</div>

				<div class={ style.details }></div>
				<div class= { style_iphone.container }>
					{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData } text="Locate me and show me the weather"/ > : null }
				</div>
			</div>
		);
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json['name'] + "," + parsed_json['sys']['country'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];
		var planTripButton = <PlanTripButton class={ style_iphonePTB.button } clickFunction={ this.showPlanTripPage }/>
		var unitButton = <UnitButton class={style_unit.button} clickFunction={this.swapUnits} unit={this.state.units === "metric" ? "F" : "C"} />
		var locationButton = <Button class={style_iphone.button} clickFunction={this.showSetLocationPage} text="Location" />
		var refreshButton = <Button class={style_iphone.button} clickFunction={this.fetchWeatherData} text="Refresh" />
		var fiveDayForecast = <FiveDayForecast location = {this.state.location} units={this.state.units} />

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions,
			planTripButton : planTripButton,
			unitButton : unitButton,
			locationButton : locationButton,
			refreshButton : refreshButton,
			fiveDayForecast : fiveDayForecast
		});
	}
}
