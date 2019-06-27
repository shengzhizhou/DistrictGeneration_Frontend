import React from 'react';
import ReactDOM from "react-dom";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import "leaflet-realtime";
import "leaflet-ajax";
import "./Map.css"
import io from 'socket.io-client';
import {Radar,Bar,Pie,Doughnut} from "react-chartjs-2";
import hashmap from 'hashmap';


import { Container, Row, Col }  from "react-bootstrap";
import MyRadar from "./MyRadar";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import DistrictInfo from "./DistrictInfo";

const Wrapper = styled.div`
width: ${props => props.width};
height: ${props => props.height};
`;
export default class Map extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            info: '',
            data: [],
            open: true,
            state: '',
        };
        this.stateStyle = this.stateStyle.bind(this);
        this.precinctStyle = this.precinctStyle.bind(this);
        this.districtStyle = this.districtStyle.bind(this);
        this.highlightFeature = this.highlightFeature.bind(this);
        this.resetHighlight = this.resetHighlight.bind(this);
        this.zoomToFeature = this.zoomToFeature.bind(this);
        this.onEachFeature = this.onEachFeature.bind(this);
        this.updatePrecinctInfo = this.updatePrecinctInfo.bind(this);
        this.addCompare = this.addCompare.bind(this);
        // this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.newDistrict = null
    }

    componentDidUpdate(prevProps){
        if (prevProps.selectedState  !== this.props.selectedState ) {

            this.stateLayer.eachLayer((layer)=> {
                if(layer.feature.properties.name === this.props.selectedState){
                    this.mymap.flyToBounds(layer);
                }
            })
        }

    }
    stateStyle(feature) {
        return {
            fillColor: 'white',
            weight: 2,
            opacity: 1,
            color: 'white',
        };
    }
    precinctStyle(feature) {
        return {
            fillColor: 'white',
            weight: 1,
            opacity: 1,
            color: 'white',
        };
    }

    updatePrecinctInfo(props){
        var chartData = {
            labels: ['Asian', 'African', 'Other', 'Hispanic','Hawaiian'],
            datasets:[
                {
                    label:'Population',
                    data:[
                        props.asian,
                        props.black,
                        props.other,
                        props.hispanic,
                        props.hawaiian,
                    ],
                    backgroundColor:
                    [
                        'rgb(102, 255, 255,0.7)',
                        'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
            ]

                }
            ],

        }
        ReactDOM.render(<MyRadar vote = {props} chartData={chartData}/>,this.precinctInfo)
    }
    districtStyle(feature) {
        return {
            fillColor: feature.properties.COLOR,
            weight: 1,
            opacity: 1,
            fillOpacity:1,
            color: 'white',
        };
    }
    newDistrictStyle(feature){
        if(feature.properties.isMajorMinor === 'true'){
            return {
                fillColor: feature.properties.COLOR,
                weight: 1,
                opacity: 1,
                fillOpacity: 1,
                color: 'white',
            };
        }else {
            return {
                fillColor: feature.properties.COLOR,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7,
                color: 'white',
            };
        }
    }
    highlightFeature(e) {
        var layer = e.target;
        layer.openPopup()
        layer.setStyle({
            weight: 3,
            color: 'yellow',
        });

        this.updatePrecinctInfo(layer.feature.properties);
    }
    resetHighlight(e) {
        let list = this.props.compareList;
        for(let i = 0; i < list.length;i++) {
            if (list[i] === e.target) {
                return
            }
        }
        e.target.setStyle({
            weight: 1,
            color: 'white'
        });
        //this.paLayer.resetStyle(e.target);
    }
    addCompare(e){
        let list = this.props.compareList;
        for(let i = 0; i < list.length;i++){
            if(list[i] === e.target){
                e.target.setStyle({
                    weight: 1,
                });
                list.splice(i, 1)
                return;
            }
        }
        list.push(e.target)
        e.target.setStyle({
            weight: 3,
        });
        this.props.updateCompare(list);
    }



    onEachFeature(feature, layer) {
        var customOptions =
            {
                'maxWidth': '400',
                'width': '200',
                'height': 200,
                'className' : 'precinctCustom'
            }
        layer.bindPopup(this.precinctInfo,customOptions)
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.zoomToFeature,
            contextmenu : this.addCompare,
        });

    }
  componentDidMount(){
      this.props.socket.on('updateColor', (data)=> {
          var datas = data.split("$")
          if(datas.length === 2){
              var info = JSON.parse(datas[1]);
              this.districtInfo.update(info.properties)
          }
        var array = datas[0].split(',');
        var datamap = new hashmap();

        for(var i=0; i<array.length; i++){
          var temp = array[i].split(':');
          datamap.set(temp[0],temp[1]);
        }
        if(this.props.selectedState === 'Pennsylvania') {
            this.paLayer.eachLayer(function (layer) {
                if (datamap.has(layer.feature.properties.GEOID10)) {
                    layer.setStyle({
                        fillColor: datamap.get(layer.feature.properties.GEOID10),
                        fillOpacity: 1
                    })
                }
            })
        }else if(this.props.selectedState === 'New Mexico'){
            this.nmLayer.eachLayer(function (layer) {
                if (datamap.has(layer.feature.properties.GEOID10)) {
                    layer.setStyle({
                        fillColor: datamap.get(layer.feature.properties.GEOID10),
                        fillOpacity: 1
                    })
                }
            })
        }else if(this.props.selectedState === 'Iowa'){
            this.iaLayer.eachLayer(function (layer) {
                if (datamap.has(layer.feature.properties.GEOID10)) {
                    layer.setStyle({
                        fillColor: datamap.get(layer.feature.properties.GEOID10),
                        fillOpacity: 1
                    })
                }
            })
        }
      });

      this.props.socket.on('updateDistrictBoundary',(data)=>{
          var boundry = JSON.parse(data)
          this.newDistrict = L.geoJson(boundry,{style: this.newDistrictStyle,onEachFeature: this.onEachFeature})
          this.newDistrict.eachLayer((layer)=> {
              layer.setStyle({
                  fillColor : layer.feature.properties.COLOR,
                  fillOpacity:1
              })
          })
          this.baseLayer.addBaseLayer(this.newDistrict,"new District")
      })
      this.mymap = L.map(this.refs.mymap, {
        zoomControl: false
        //... other options
    }).setView([37.8, -70], 4);
      this.popup = L.popup();
      /*
     L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
         maxZoom: 15,
         minZoom:2,
         id: 'mapbox.streets',
         accessToken: 'pk.eyJ1IjoicWllbiIsImEiOiJjanJ3aWg5ajAwZDVkNDlvOXF6OWh3dGJ3In0.ewZYRX60IgGsmtsGIffdfQ'
     }).addTo(this.mymap);
     */
      //https://api.mapbox.com/styles/v1/ccall/cju4omhh623za1flgiymq3do0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2NhbGwiLCJhIjoiY2p1NG9qemVhMTAxazQ0cDg1NWoweW5kYSJ9.f45ljFqvaHsgWlC1VjJ-Iw
      //https://api.mapbox.com/styles/v1/linzengxian/cju3oaz0b1tcm1fo6enjxem39/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibGluemVuZ3hpYW4iLCJhIjoiY2pyd2J0MGx3MGI5aDQzcXJmbmVxYTk1OCJ9.Y-plQvOEnSriRzc9EcxqQA

      L.tileLayer('https://api.mapbox.com/styles/v1/ccall/cju4omhh623za1flgiymq3do0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2NhbGwiLCJhIjoiY2p1NG9qemVhMTAxazQ0cDg1NWoweW5kYSJ9.f45ljFqvaHsgWlC1VjJ-Iw', {
      maxZoom: 15,
          minZoom:2,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoicWllbiIsImEiOiJjanJ3aWg5ajAwZDVkNDlvOXF6OWh3dGJ3In0.ewZYRX60IgGsmtsGIffdfQ'
    }).addTo(this.mymap);

      L.control.zoom({
          position:'bottomleft'
      }).addTo(this.mymap);
      this.stateLayer = L.geoJson.ajax("https://raw.githubusercontent.com/QienJiang/CSE308/master/map-app-react/public/paksmi.json",{style: this.stateStyle,onEachFeature: this.onEachFeature});
      this.nmLayer = L.geoJson.ajax("https://raw.githubusercontent.com/QienJiang/CSE308/master/map-app-react/public/nm_data.geojson",{style: this.precinctStyle,onEachFeature: this.onEachFeature});
      this.iaLayer = L.geoJson.ajax("https://raw.githubusercontent.com/QienJiang/CSE308/master/map-app-react/public/ia_data.geojson",{style: this.precinctStyle,onEachFeature: this.onEachFeature})
      this.paLayer = L.geoJson.ajax("https://raw.githubusercontent.com/QienJiang/CSE308/master/map-app-react/public/pa_data.geojson",{style: this.precinctStyle,onEachFeature: this.onEachFeature});
      this.paDistrict = L.geoJson.ajax("https://raw.githubusercontent.com/QienJiang/CSE308/master/map-app-react/public/PaCongressional2019_01.geojson",{style: this.districtStyle,onEachFeature: this.onEachFeature});
      this.nmDistrict = L.geoJson.ajax("https://raw.githubusercontent.com/QienJiang/CSE308/master/map-app-react/public/nm_congressional_district.geojson",{style: this.districtStyle,onEachFeature: this.onEachFeature})
      this.iaDistrict = L.geoJson.ajax("https://raw.githubusercontent.com/QienJiang/CSE308/master/map-app-react/public/IA_finalGeoJson.geojson",{style: this.districtStyle,onEachFeature: this.onEachFeature})
      /*
      this.stateLayer.on('data:loaded',()=> {
          this.stateLayer.eachLayer(function (layer) {
              layer._path.id = layer.feature.properties.NAME10;
          })
      })
      */
      this.precinctInfo = L.DomUtil.create('div', 'precinctInfo')
      this.mymap.addLayer(this.stateLayer);
      this.mymap.on('zoomend', () =>{
          if (this.mymap.getZoom() >6){
              if(this.props.selectedState === 'New Mexico') {
                  this.mymap.removeLayer(this.iaLayer);
                  this.mymap.removeLayer(this.paLayer);
                  this.mymap.addLayer(this.nmLayer);
              }
              else if(this.props.selectedState === 'Pennsylvania') {
                  this.mymap.removeLayer(this.iaLayer);
                  this.mymap.removeLayer(this.nmLayer);
                  this.mymap.addLayer(this.paLayer);

              }else if(this.props.selectedState === 'Iowa'){
                  this.mymap.removeLayer(this.nmLayer);
                  this.mymap.removeLayer(this.paLayer);
                  this.mymap.addLayer(this.iaLayer);
              }
              this.mymap.removeLayer(this.stateLayer);
          }
          else {
              this.mymap.removeLayer(this.iaLayer);
              this.mymap.removeLayer(this.nmLayer);
              this.mymap.removeLayer(this.paLayer);
              this.mymap.addLayer(this.stateLayer);
          }
      });
        this.mymap.on('overlayadd',()=>{
            if(this.props.selectedState === 'New Mexico'){
                this.mymap.removeLayer(this.nmLayer)
                this.mymap.addLayer(this.nmDistrict)
            }else if(this.props.selectedState === 'Pennsylvania'){
                this.mymap.removeLayer(this.paLayer)
                this.mymap.addLayer(this.paDistrict)
            }
        })
      this.mymap.on('overlayremove',()=>{
          if(this.props.selectedState === 'New Mexico'){
              this.mymap.removeLayer(this.nmDistrict)
              this.mymap.addLayer(this.nmLayer)
          }else if(this.props.selectedState === 'Pennsylvania'){
              this.mymap.removeLayer(this.paDistrict)
              this.mymap.addLayer(this.paLayer)
              //this.mymap.addLayer(this.paDistrict)
          }
      })



          /*
                this.info = L.control({position: 'topleft'});
                this.info.onAdd = function (map) {
                    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                    this.update();
                    return this._div;
                };
                this.info.update = function (props) {
                    var chartData = {
                        labels: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'New Bedford'],
                        datasets:[
                            {
                                label:'Population',
                                data:[
                                    617594,
                                    581045,
                                    553060,
                                    406519,
                                    305162,
                                    705072
                                    ],
                                backgroundColor:
                                    'rgb(102, 255, 255,0.7)'

                            }
                            ],

                    }
                    ReactDOM.render(<Radar width={200}
                                           height={200}
                                           options={{
                                               legend : {
                                                   labels : {
                                                       fontColor : 'white'
                                                   }
                                               },
                                               maintainAspectRatio: false,
                                               scale: {
                                                   ticks: {
                                                       display: false,
                                                       maxTicksLimit: 3
                                                   },
                                                   pointLabels:{
                                                       fontColor: 'white'
                                                   },
                                                   gridLines: { color: 'rgb(0, 255, 255)'  },
                                                   angleLines: { color: 'rgb(0, 255, 255)' }
                                               }
                                           }
                                           } data = {chartData}/>,this._div)

                    this._div.innerHTML = '<h4>Detail Information</h4>' +  (props ?
                        '<b>'+ 'GeoId: ' + props.GEOID10 + '</b><br />' +'Population: '+ props.POP100
                        + '<br />' + 'democracy vote: ' +props.GOV_DVOTE_+ '<br/>' + 'republican vote: ' + props.GOV_RVOTE_
                        + <MyRadar data = {chartData}/>
                        : 'Hover over a precinct');

                };
                this.info.addTo(this.mymap);
          */

      this.districtInfo = L.control({position: 'topleft'});
      this.districtInfo.onAdd = function (map) {
          this._districtDiv = L.DomUtil.create('div', 'districtInfo');
          this.update()
          return this._districtDiv;
      };

      this.districtInfo.update = function (props) {
          let nf = new Intl.NumberFormat()
          this._districtDiv.innerHTML = '<h4>District Information</h4>' +  (props ?
              '<b>'+ 'GeoId: ' + props.GEOID10 + '</b><br />' +'Population: '+ nf.format(props.POP100)
              + '<br />' + 'Democracy vote: ' + nf.format(props.GOVDV2010) + '<br/>' + 'Republican vote: ' + nf.format(props.GOVRV2010)
              : 'run algorithm to see detail');
      };
      this.districtInfo.addTo(this.mymap);

      this.overlayMaps = {
      }
      this.baseLayer = L.control.layers(null,this.overlayMaps,{position:'bottomleft'}).addTo(this.mymap);
  /*  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.{ext}', {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: 'abcd',
          minZoom: 0,
          maxZoom: 20,
          ext: 'png'
      }).addTo(this.mymap);
      */

  }
  zoomToFeature(e) {
    this.mymap.flyToBounds(e.target);
    if(e.target.feature.properties.name === 'New Mexico' ||
        e.target.feature.properties.name === 'Iowa'||
        e.target.feature.properties.name === 'Pennsylvania') {
        this.props.setSelectedState(e.target.feature.properties.name);
        if(e.target.feature.properties.name === 'New Mexico'){
            if(this.newDistrict!==null) {
                this.baseLayer.removeLayer(this.newDistrict)
            }
            this.baseLayer.removeLayer(this.paLayer)
            this.baseLayer.removeLayer(this.iaLayer)
            this.baseLayer.removeLayer(this.paDistrict)
            this.baseLayer.removeLayer(this.iaDistrict)
            this.baseLayer.addBaseLayer(this.nmDistrict,"Original")
            this.baseLayer.addBaseLayer(this.nmLayer,"Precinct")
        }else if(e.target.feature.properties.name === 'Pennsylvania'){
            if(this.newDistrict!==null) {
                this.baseLayer.removeLayer(this.newDistrict)
            }
            this.baseLayer.removeLayer(this.nmLayer)
            this.baseLayer.removeLayer(this.iaLayer)
            this.baseLayer.removeLayer(this.nmDistrict)
            this.baseLayer.removeLayer(this.iaDistrict)
            this.baseLayer.addBaseLayer(this.paDistrict,"Original")
            this.baseLayer.addBaseLayer(this.paLayer,"Current")
        }else if (e.target.feature.properties.name === 'Iowa'){
            if(this.newDistrict!==null) {
                this.baseLayer.removeLayer(this.newDistrict)
            }
            this.baseLayer.removeLayer(this.nmLayer)
            this.baseLayer.removeLayer(this.paLayer)
            this.baseLayer.removeLayer(this.nmDistrict)
            this.baseLayer.removeLayer(this.paDistrict)
            this.baseLayer.addBaseLayer(this.iaDistrict,"Original")
            this.baseLayer.addBaseLayer(this.iaLayer,"Current")
        }


    }
        /*
    this.setState({
        state : e.target.feature.properties.GeoId,
    })
    */
    //  this.socket.emit('messageevent', {msgContent: "hello"});
/*
      this.stateLayer.eachLayer(function (layer) {
          if(layer.feature.properties.NAME10 == 'New York'){
              layer.setStyle({
                  fillColor : 'blue'
              })
          }
      })
*/
  }


  render() {
    return(
      <div ref = 'mymap' style={{height:"100%",width:"100%",position:"absolute", 'zIndex': 0}}/>
    )
  };
}
