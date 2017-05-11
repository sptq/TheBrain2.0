// @flow

import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import update from 'immutability-helper'
import { Link } from 'react-router-dom'
import FacebookLogin from 'react-facebook-login'

// const createMessage = gql`
//     mutation addMessage($channelName: String!, $handle: String!, $message: String!) {
//         addMessage(channelName: $channelName, handle: $handle, message:$message) {
//             handle, message
//         }
//     }`;
//

export class WellDone extends React.Component {
  responseFacebook = (response: { accessToken: string }) => {
    console.log(response)
    this.props.logInWithFacebook({ accessToken: response.accessToken })
  }

  render () {
    return <div className="welldone">
      First video done! Click: <Link to={`/questions`}>here</Link> to answer some questions about the video
      <FacebookLogin
        appId="794881630542767"
        autoLoad={false}
        fields="name,email,picture"
        callback={this.responseFacebook} />
    </div>
  }
}

const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!){
        logInWithFacebook(accessToken:$accessToken) {
            _id, username, activated
        }
    }
`

export default compose(
  graphql(logInWithFacebook, {
    props: ({ ownProps, mutate }) => ({
      logInWithFacebook: ({ accessToken }) => mutate({
        variables: {
          accessToken
        },
        updateQueries: {
          CurrentUser: (prev, { mutationResult }) => {
            return update(prev, {
              CurrentUser: {
                $set: mutationResult.data.logInWithFacebook
              }
            })
          }
        }
      })
    })
  })
)(WellDone)
