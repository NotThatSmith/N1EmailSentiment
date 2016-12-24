import {React} from 'nylas-exports';

import xhr from 'xhr';

export default class PersonalLevelIcon extends React.Component {
  // Note: You should assign a new displayName to avoid naming
  // conflicts when injecting your item
  static displayName = 'SentimentStatus';

  constructor(props) {
    super(props);
    this.state = {
      score: null
    }
    this.findSentiment(this.props.message.computePlainText());
  }
  static propTypes = {
    message: React.PropTypes.object.isRequired,
  };

  findSentiment(text) {
    if(!text || text.trim().length === 0) return;
    xhr.post({
      json: true,
      body: {
        documents: [{
          language: 'en',
          id: '1',
          text: text
        }]
      },
      uri: 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Ocp-Apim-Subscription-Key": 'XXXXX Subscription key goes here XXXXX'

      }
    }, (err, resp, body) => {
      if(resp.statusCode != 200 || body.errors.length > 0) return;
        console.log('body ', body.documents[0].score)
        this.setState({score: body.documents[0].score})

    })
  }

  // React components' `render` methods return a virtual DOM element to render.
  // The returned DOM fragment is a result of the component's `state` and
  // `props`. In that sense, `render` methods are deterministic.
  render() {
      return (
          <div className='sentiment-status'>
            {
              this.state.score == null 
                ? '' 
                : this.state.score > 0.7 
                  ? '😀😀😀😀 This email is positive! 😀😀😀😀' 
                  : this.state.score < 0.3 
                    ? '😔😔😔😔 This email is negative 😔😔😔😔' 
                    : ' 😐😐😐😐 This email is neutral, things could be worse 😐😐😐😐'
            }
          </div>
        )
  }
}