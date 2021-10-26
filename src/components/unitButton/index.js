// import preact
import { h, render, Component } from 'preact';

export default class UnitButton extends Component {
    render() {
        let cFunction = this.props.clickFunction;
		if(typeof cFunction !== 'function'){
			cFunction = () => {
				//make it go to new screen
				console.log("passed something as 'clickFunction' that wasn't a function !");
			}
        }
        
        return (
            <div>
                <button onClick={cFunction}>
                    {this.props.unit}
                </button>
            </div>
        );
    }
}