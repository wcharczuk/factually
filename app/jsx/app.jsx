var ELECTION_YEAR = "2016";



var orderByDescending = function(collection, selector) {
  if(typeof(selector) === 'undefined') { selector = function(_) { return _; } }

  var sortable = [];
  for(var x = 0; x < collection.length; x++) {
    sortable.push(collection[x]);
  }

  var output = sortable.sort(function(a, b){
    var a0 = selector(a);
    var b0 = selector(b);

    if(a0 == b0) { return 0; }
    else if (a0 > b0) { return -1; }
    else { return 1; }
  });

  return output;
}

var take = function(collection, number) {
    var output = [];

    if(number > collection.length) { number = collection.length; }

    for(var x =0; x < number; x++) {
        output.push(collection[x]);
    }
    return output;
}


var DataGridBody = React.createClass({
  render: function() {
    var findCandidateById = function(id) {
      return this.props.candidates.first(function(c) {
        return c.id == id
      });
    };

    var issues = this.props.issues.issues.map(function(issue) {

      var candidatePositions = [];
      for (var objectKey in issue.byCandidate) {
        var value = issue.byCandidate[objectKey];
        candidatePositions.push(value);
      }

      var byCandidate = candidatePositions.map(function(position) {
        return (
          <td>{position}</td>
        )
      });

      return (
        <tr>
          <td className="issue-category">{issue.category}</td>
          <td className="issue-description">{issue.description}</td>
          <td className="america-for">{issue.america.for}</td>
          <td className="america-against">{issue.america.against}</td>
          <td className="america-result">{issue.america.result}</td>
          {byCandidate}
        </tr>
      );
    });
    return (
      <tbody>
        {issues}
      </tbody>
    );
  }
});

var DataGridHeader = React.createClass({
  render: function() {
    var candidates = this.props.candidates.candidates.map(function(candidate) {
      return (
        <th><a href="{candidate.website}" target="_blank">{candidate.firstName} {candidate.lastName}</a></th>
      )
    });
    return (
      <thead>
        <tr>
          <th>Issue Category</th>
          <th>Issue Description</th>
          <th>For</th>
          <th>Against</th>
          <th>Result</th>
          {candidates}
        </tr>
      </thead>
    );
  }
});

var DataGrid = React.createClass({
  getInitialState: function() {
    return { issues: { issues: [] }, candidates: { candidates: [] } };
  },
  componentDidMount: function() {
    $.ajax({
      url: "data/2016/issues.json",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({issues: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("data/2016/issues.json", status, err.toString());
      }.bind(this)
    });
    $.ajax({
      url: "data/2016/candidates.json",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({candidates: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("data/2016/candidates.json", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <table className="table issues">
        <DataGridHeader issues={this.state.issues} candidates={this.state.candidates} />
        <DataGridBody issues={this.state.issues} candidates={this.state.candidates} />
      </table>
    );
  }
});

React.render(
  <DataGrid/>,
  document.getElementById('content')
);

var Leaderboard = React.createClass({
  getInitialState: function() {
    return { candidates: { candidates: [] } };
  },
  componentDidMount: function() {
    $.ajax({
      url: "data/2016/candidates.json",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({candidates: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("data/2016/candidates.json", status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    console.log(this.state.candidates)

    var topCandidates = take(orderByDescending(this.state.candidates.candidates, function(_) { return _.alignmentWithAmericans;}), 3).map(function(candidate){
      return (
        <li>{candidate.firstName} {candidate.lastName}</li>
      );
    });
    return (
      <ol>
        {topCandidates}
      </ol>
    );
  }
});

React.render(
  <Leaderboard/>,
  document.getElementById('leaderboard')
);