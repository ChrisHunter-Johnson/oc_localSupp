import React from 'react'
import axios from 'axios'


class Needs extends React.Component {
 state = {
    needs: []
  };

  componentDidMount(){
   axios
    .get('/api/needs')
    .then(response => {
     this.setState({ needs: response.data.needs });
    })
  }
  renderAllNeeds = () => {
    return(
      <ul>
        {this.state.needs.map(need => (
          <li key={need}>{need}</li>
        ))}
      </ul>
    )
  }
  render() {
    return (
      <div>
      <div>
        {this.renderAllNeeds()}
      </div>
      </div>
    )
  }
}

export default Needs
