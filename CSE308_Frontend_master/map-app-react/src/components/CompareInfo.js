import React,{Component} from 'react'



class CompareInfo extends Component{
    constructor(props) {
        super(props);
        this.nf = new Intl.NumberFormat()

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps !== this.props){
            this.setState({
                chartData:this.props.chartData
            })
        }
    }

    render() {
        return (
            <div style={{'width' : 410,'white-space': 'nowrap','overflow-x':'auto','box-shadow': '0px 0px 10px 5px rgb(255, 255, 179)'}}>
                {this.props.compareList.map((e)=>{
                    return <p style={{display: 'inline-block'}}>
                        Id: {e.feature.properties.GEOID10 || e.feature.properties.name} <br/>
                        Population: {this.nf.format(e.feature.properties.total)}<br/>
                        Democracy  vote: {this.nf.format(e.feature.properties.GOVDV2010)} <br/>
                        Republican vote: {this.nf.format(e.feature.properties.GOVRV2010)}
                    </p>
                })}
            </div>
        )
    }

}

export default CompareInfo