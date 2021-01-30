import React, { Component } from 'react';

const { EventHubConsumerClient, latestEventPosition } = require("@azure/event-hubs");


const subscriptionOptions = {
    startPosition: latestEventPosition
};

var subscription="";
var client=""; 

class IotReciever extends Component {

    async componentDidMount() {
        const events="";
        const client = new EventHubConsumerClient(
            this.props.eventHubConsumerGroup,
            this.props.eventHubEndpoint,
            this.props.eventHubEndpoint.substring(this.props.eventHubEndpoint.search("EntityPath")+11,this.props.eventHubEndpoint.length)
        );
        subscription = client.subscribe(
            {
                processEvents: async (events, context) => {
                    this.props.callback(events)
                },
                processError: async (err, context) => {
                    this.props.callback(events)
                }
            },
            subscriptionOptions
        );

    }

    componentWillUnmount() {
        subscription.close();
        client.close();
        console.log(`Exiting sample`);
    }

    render() {
        
        return (
            <>
            </>
        );
    }
}

IotReciever.propTypes = {

};

export default IotReciever;