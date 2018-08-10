import React, { Component } from "react";
import PropTypes from "prop-types";


class NodeListProvider extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired
  };
  state = {
      nodeList_all: [],
      loaded: false,
      placeholder: "Loading..."
    };
  componentDidMount() {
    fetch(this.props.endpoint)
      .then(response => {
        if (response.status !== 200) {
            console.log("fail");
            return this.setState({ placeholder: "Something went wrong" });
        }
        return response.json();
      }).then(nodeList_all => {

        return this.setState({ nodeList_all: nodeList_all, loaded: true })
    });
  }
  render() {
    const { nodeList_all, loaded, placeholder } = this.state;

    // console.log("nodeList provider in render: ");
    // console.log(nodeList_all);

    return loaded ? this.props.render(nodeList_all) : <p>{placeholder}</p>;
  }
}
export default NodeListProvider;
