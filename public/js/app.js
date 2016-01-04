//==========================//
//========= Player =========//
//==========================//
var Player = React.createClass({
  getInitialState : function(){
    return {
      pause: true
    };
  },
  playToggle: function(){
    this.setState(function(state){
      if(this.setState.pause) return{ pause: false };
      else return { pause: true };
    });
  },
  render: function() {
    return (<audio controls className="audio"><source src={this.props.source}></source></audio>);
  }
});

//==========================//
//======= Audio List =======//
//==========================//
var AudioList = React.createClass({
  render: function(){
    function keyed(str){
      var nextStr = str.substring(str.lastIndexOf("/") + 1, str.length);
      return nextStr.split(".")[0];
    }

    if(this.props.clips.length >0){
      return (
        <div className="PlayerList">
          {
            this.props.clips.map(function(clip) {
              return (<Player key={keyed(clip)} ref={keyed(clip)} source={clip} />)
            })
          }  
        </div>
      );
    }
    else{
      return (<div><p>No Audio</p></div>);
    }
  }
});

//==========================//
//========= Content ========//
//==========================//
var MainContent = React.createClass({
  render: function(){
    if(this.props.results){
      return (
        <div><p className="definition"><span className="word">{this.props.word}:</span>{this.props.definition}</p><AudioList clips={this.props.audio}/></div>
      );
    }
    else{
      return (<div><p class="error">This word not found homie.</p></div>);
    }
  }
});

//==========================//
//=========== App ==========//
//==========================//
var App = React.createClass({
  render: function () {
    console.log("props",this.props.appData);
    return (<div><input className={this.props.appData.results ? 'search' : 'error search'} type="text" placeholder="UrbanBot" id="search"/><div><MainContent audio={this.props.appData.audio} word={this.props.appData.title} definition={this.props.appData.definition} results={this.props.appData.results}/>
      </div></div>);
  },
});

var initialState = {
  title: "",
  audio: [],
  definition: "",
  results: null,
};

ReactDOM.render(<App appData={initialState}/>,document.getElementById('app-container'));


//==========================//
//======= RxJS stuff =======//
//==========================//

var requestUrl = 'http://localhost:8081/api?';

var initRequestStream = Rx.Observable.just(requestUrl + readPath())
    .flatMap(requestUrl =>
      Rx.Observable.fromPromise(jQuery.getJSON(requestUrl + readPath()))
    );

var updateStream = Rx.Observable.fromEvent($('#search'), 'keyup change')
    .pluck('target', 'value')
    .filter(function (text) {
      return text.length > 2;
    })
    .do(function(term){
      setPath(term);
      return term;
    })
    .flatMap(requestParam =>
      Rx.Observable.fromPromise(jQuery.getJSON(requestUrl + requestParam))
    )
    .debounce(100);

var dataStream = initRequestStream.merge(updateStream);

dataStream.subscribe(response => {
  ReactDOM.render(<App appData={response}/>,document.getElementById('app-container'));
});

//==========================//
//=== History management ===//
//==========================//
function setPath(term){
  var path = '#' + String(term).replace(/\s+/g, '-').toLowerCase();

  if(history.pushState) {
    history.pushState(null, null, path);
  }
  else {
      location.hash = path;
  }
}

function readPath() {
  if(window.location.hash) {
    console.log("hash set",window.location.hash);
    return window.location.hash.replace(/-/g, ' ');;
  } else {
    console.log("hash not set");
    return '';
  }
}


