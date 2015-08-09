var ELECTION_YEAR = "2016";

if (!Array.prototype.Each) {
  Array.prototype.Each = function(action) {
    for (var x = 0; x < this.length; x++) {
      var elem = this[x];
      action(elem, x);
    }
  };
}

if (!Array.prototype.Where) {
  Array.prototype.Where = function(predicate) {
    var results = [];
    this.Each(function(elem) {
      if (predicate(elem)) {
        results.push(elem);
      }
    });
    return elem;
  }
}

if (!Array.prototype.First) {
  Array.prototype.First = function(predicate) {
    if (this.length == 0) {
      return null;
    }

    if (!predicate) {
      return this[0];
    }

    var foundElem = null;
    for (var x = 0; x < this.length; x++) {
      var elem = this[x];
      if (predicate(elem)) {
        return elem;
      }
    };
    return null;
  }
}

var DataGridBody = React.createClass({
  render: function() {
    var findCandidateById = function(id) {
      return this.props.candidate.First(function(c) {
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
      <table className="issues">
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