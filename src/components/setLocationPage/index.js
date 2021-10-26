import { h, render, Component } from 'preact';

import style from './style';

import $ from 'jquery';

import Button from '../button';

import LocationButton from '../locationButton';

import style_iphone from '../button/style_iphone';


export default class SetLocationPage extends Component {


    constructor(props) {
        super(props);
        this.setState({cityText: false});

        if(typeof this.props.returnFunction !== 'function'){
			this.props.returnFunction = (location) => {
				//make it go to new screen
				console.log("error: return function was not passed, no way to get to home screen");
			}
        }
    }

    
    handleSubmit = (event) => {
        event.preventDefault();
    }

    handleInputChange = (event) => {
        this.checkValidLocation(event.target.value);
        //this.setState({cityText: event.target.value});
    }

    updateLocation = (parsed_json) => {
        var location = parsed_json['name'] + ","  + parsed_json['sys']['country'];
        var storedLocations = localStorage.getItem("storedLocations");
        storedLocations = storedLocations + ":" + location;
        localStorage.setItem("storedLocations", storedLocations);
        this.props.returnFunction(true, location);
    }

    invalidLocation = (req, err) => {
        console.log("API call failed " + err);
        this.setState({cityText:"Invalid city"});
    }

    checkValidLocation = (location) => {
        var url = "http://api.openweathermap.org/data/2.5/weather?APPID=0cf17e23b1d108b29a4d738d2084baf5&q=" + location;
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: this.updateLocation,
            error: this.invalidLocation
        });
    }

    clearSavedLocations = () => {
        //localStorage.removeItem("storedLocations");
        //var locations = ["London,UK"];
        //var locations = "London,UK:Boston,US";

        // clears out the list of saved locations, but adds the current location back to the list
        var locations = localStorage.getItem("location");
        localStorage.setItem("storedLocations", locations);  
        console.log("Locations cleared");
        this.forceUpdate();
    }

    buttonSelection = (location) => {
        //console.log("Loc: " + location);
        this.props.returnFunction(true, location);
    }

    render() {

        var storedLocations = localStorage.getItem("storedLocations");
        //console.log(storedLocations);
        if(!storedLocations) {
            //storedLocations = "London,UK:Boston,US";
            // if there is nothing stored, simply add the current location
            storedLocations = localStorage.getItem("location");
            localStorage.setItem("storedLocations", storedLocations);
        }
        storedLocations = storedLocations.split(":");
        var locationButtons = [];
        
        for(var i = 0; i < storedLocations.length; i++) {
            locationButtons.push(
                <LocationButton class={style.button} text={storedLocations[i]} clickFunction={this.buttonSelection} param1={storedLocations[i]} />
            );
        }
        //console.log("Location buttons: " + locationButtons.length);
        return (
            <div>
                <h1>Search for a Location</h1>
                <p>{this.state.cityText}</p>
                <form onSubmit={this.handleSubmit}>
                <p><input type="text" name="location" value="" placeholder="London" onChange={this.handleInputChange} /></p>
                <div class={style.container}>
                <Button class={style.button} text="Search" clickFunction={this.handleSubmit}/>
                <Button class={style.button} text="Go Back Home" clickFunction= {() => {this.props.returnFunction(false, "");}} />
                </div>
                </form>
                <h1>Saved Locations</h1>
                <div class={style.buttonlist}>
                    {locationButtons}
                </div>
                <div class={style.clearcontainer}>
                    <Button class={style.button} text="Clear Saved Locations" clickFunction={this.clearSavedLocations} />
                </div>

                  
            </div>
        );

    }

    

    
}