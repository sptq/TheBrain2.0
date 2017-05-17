import React from 'react'
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'
import update from 'immutability-helper'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class FBLoginButton extends React.Component {
  componentWillMount() {
    console.log('* LOG * FBLoginButton componentWillMount')
  }

  componentWillUnmount() {
    console.log('* LOG * FBLoginButton componentWillUnmount')
  }

  render () {
    return (
      <FBLogin style={{ marginVertical: 10 }}
               ref={(fbLogin) => {
                 this.fbLogin = fbLogin
               }}
               permissions={['email',]}
               // loginBehavior={FBLoginManager.LoginBehaviors.Native}
               onLogin={(data) => {
                 console.log('Logged in!')
                 this.props.logInWithFacebook({ accessToken: data.credentials.token })
               }}
               onLogout={() => {
                 console.log('Logged out.')
               }}
               onLoginFound={(data) => {
                 console.log('Existing login found.')
                 console.log(data)
                 this.props.logInWithFacebook({ accessToken: data.credentials.token })
               }}
               onLoginNotFound={() => {
                 console.log('No user logged in.')
               }}
               onError={(data) => {
                 console.log('ERROR')
                 console.log(data)
               }}
               onCancel={() => {
                 console.log('User cancelled.')
               }}
               onPermissionsMissing={(data) => {
                 console.log('Check permissions!')
                 console.log(data)
               }}
      />
    )
  };

}

const logInWithFacebook = gql`
    mutation logInWithFacebook($accessToken: String!){
        logInWithFacebook(accessToken:$accessToken) {
            _id, username, activated
        }
    }
`

export default graphql(logInWithFacebook, {
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
})(FBLoginButton)
