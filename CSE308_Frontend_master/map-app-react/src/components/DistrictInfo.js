import React,{Component} from 'react'


class DistrictInfo extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:props.data
        }
        this.nf = new Intl.NumberFormat()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props){
            this.setState({
                data:this.props.data
            })
        }
    }

    render() {
        return (
            <div>
                <p>
                    Id: {this.state.data.GEOID10 } <br/>
                    Population: {this.nf.format(this.state.data.total)}<br/>
                    Democracy  vote: {this.nf.format(this.state.data.GOVDV2010)} <br/>
                    Republican vote: {this.nf.format(this.state.data.GOVRV2010)}<br/>
                    white: {this.nf.format(this.state.data.white)}<br/>
                    asian: {this.nf.format(this.state.data.asian)}<br/>
                    african: {this.nf.format(this.state.data.black)}<br/>
                    hawaiian: {this.nf.format(this.state.data.hawaiian)}<br/>
                    hispanic: {this.nf.format(this.state.data.hispanic)}<br/>
                    other: {this.nf.format(this.state.data.other)}<br/>
                </p>

            </div>
        )
    }

}

export default DistrictInfo