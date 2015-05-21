var LocationForm = React.createClass({

    getInitialState: function () {
        return {
            country: 'England',
            city: 'London',
        }
    },

    render: function () {
        return (
            <div className="row">
                <div className="small-12 medium-8 medium-centered column">
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="large-4 columns">
                                <input type="text" placeholder="City" value={this.state.city} ref="city" />
                            </div>
                            <div className="large-4 columns">
                                <input type="text" placeholder="Country" value={this.state.country} ref="country" />
                            </div>
                            <div className="large-4 columns">
                                <button type="submit" class="button postfix">Show me</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    },

    handleSubmit: function (e) {
        e.preventDefault();
        var country = React.findDOMNode(this.refs.country).value.trim();
        var city = React.findDOMNode(this.refs.city).value.trim();
        if (!country || !city) {
            return;
        }
        this.props.onSubmit({
            country: country,
            city: city,
        })
    },
});

var Results = React.createClass({

    render: function () {
        return (
            <section id="results" className="panel">
                <div className="row">
                    <div className="small-12 medium-6 medium-centered column">
                        <h3>
                            <div className="count">1234</div>
                            <div className="sub">nuclear warheads</div>
                        </h3>

                        <h4>
                            <div className="sub">Are within range of</div>
                            <div className="where">{this.props.city}, {this.props.country}</div>
                        </h4>
                    </div>
                </div>

                <div className="row">
                    <div className="small-6 medium-3 medium-offset-3 column">
                        <h5>By country</h5>
                    </div>
                    <div className="small-6 medium-3 column end">
                        <h5>By delivery</h5>
                    </div>
                </div>
            </section>
        );
    },
});

var App = React.createClass({
    handleLocationChange: function (data) {
        this.setState(data);
    },

    render: function () {
        var results;
        if (this.state) {
            results = <Results country={this.state.country} city={this.state.city} />
        } else {
            results = '';
        }

        return (
            <div>
                <LocationForm onSubmit={this.handleLocationChange} />
                {results}
            </div>
        );
    },
});

React.render(
    <App />,
    document.getElementById('app')
);