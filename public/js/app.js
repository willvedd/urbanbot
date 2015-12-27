



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
      return (<div><p>No Results beep boop</p></div>);
    }
  }
});

//==========================//
//=========== App ==========//
//==========================//
var App = React.createClass({
  getInitialState: function () {
    return {
      search: "",
      word: "",
      clips: [],
      definition: "",
    };
  },
  searchChanged: function(e){
    var self = this;
    self.setState(function(state) {
      return {search: e.target.value};
    });
    clearTimeout(this.fetchTimer);
    
    self.fetchTimer = setTimeout(function(){
      var source = 'http://localhost:8081/api?'+self.state.search;
      $.get(source, function(data) {
        var result = JSON.parse(data);
        self.setState(function(state){
          return {
            word: result.title,
            clips: result.audio,
            definition: result.definition,
          };
        });
      });
    }, 250); 
  },
  render: function () {
    return (<div><input className="search" onChange={this.searchChanged} type="text" placeholder="UrbanBot" id="search"/><div><p className="definition"><span className="word">{this.state.word}:</span>{this.state.definition}</p><AudioList clips={this.state.clips}/></div></div>);
  },
});

ReactDOM.render(<App />,document.getElementById('app-container'));