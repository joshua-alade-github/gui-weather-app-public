// import preact
import { h, render, Component } from 'preact';

export default class LocationButton extends Component {

	// rendering a function when the button is clicked
	render() {
		let cFunction = this.props.clickFunction;
		if(typeof cFunction !== 'function'){
			cFunction = (param1) => {
				console.log("passed something as 'clickFunction' that wasn't a function !");
			}
		}
		if(cFunction.length !== 1) {
			cFunction = (param1) => {cFunction();}
		}
		if(!this.props.param1) {
			this.props.param1 = localStorage.getItem("location");
		}
		let ocFunction = () => {cFunction(this.props.param1);}
		// Locate me and show me the weather
		return (
			<div>
				<button onClick={ocFunction}>
					{this.props.text}
				</button>
			</div>
		);
	}
}
