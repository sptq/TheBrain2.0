// @flow

import React from 'react'
import { Animated, Easing, Text, View } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-native'
import * as Animatable from 'react-native-animatable'
import SvgUri from 'react-native-svg-uri'

import Loading from './Loading'
import CircleButton from './CircleButton'
import Video from './Video'

import styles from '../styles/styles'
import courseLogos from '../helpers/courseLogos'

import lessonWatchedMutationParams from '../../client/shared/graphql/mutations/lessonWatchedMutationParams'
import lessonWatchedMutationSchema from '../../client/shared/graphql/queries/lessonWatchedMutationSchema'
import currentLessonQuery from '../../client/shared/graphql/queries/currentLesson'

class Lecture extends React.Component {
  state = {
    showLecture: false
  }

  componentWillMount () {
    this.infoScale = new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(this.infoScale, {
      toValue: 1,
      duration: 500,
      easing: Easing.elastic(1)
    }).start(() => this.setState({ showLecture: true }))
  }

  onChangeState = (event) => {
    console.log('Gozdecki: event', event)
    if (event.state === 'ended') {
      this.props.lessonWatchedMutation({ courseId: this.props.selectedCourse._id }).then(() => {
        let url = '/questions'
        if (this.props.data.Lesson && this.props.data.Lesson.position <= 2) {
          url = '/wellDone'
        }
        this.props.history.push(url)
      })
    }
  }

  render () {
    if (this.props.data.error) {
      return (<Text>Error... Check if server is running.</Text>)
    }

    if (!this.props.data.Lesson) {
      return (
        <View>
          <Text style={[styles.textDefault, { marginTop: 35 }]}>Congratulations!</Text>
          <Text style={[styles.menuButtonText, { paddingHorizontal: 50 }]}>You have watched all available lectures in this course.</Text>
        </View>
      )
    }

    const courseLogo = courseLogos[this.props.selectedCourse.name]
    const logoSize = courseLogo.scale * 60

    return (
      <View style={{ width: '100%' }}>
        <Animated.View style={{ transform: [{ scale: this.infoScale }] }}>
          <Text
            style={[styles.textDefault, {
              margin: 20,
              width: 220,
              alignSelf: 'center'
            }]}>
            Watch the video and answer some questions
          </Text>
        </Animated.View>

        {this.state.showLecture &&
        <Animatable.View animation='bounceIn'>
          {this.props.data.loading
            ? <View style={styles.videoPlaceholder}>
              <Loading />
            </View>
            : <Video videoId={this.props.data.Lesson.youtubeId} onChangeState={this.onChangeState}/>
          }
        </Animatable.View>
        }

        <View style={{ marginTop: 20, alignSelf: 'center' }}>
          <CircleButton radius={45} withStaticCircles>
            <SvgUri
              width={logoSize}
              height={logoSize}
              source={courseLogo.file}
              style={{ width: logoSize, height: logoSize, alignSelf: 'center' }}
            />
          </CircleButton>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedCourse: state.course.selectedCourse
  }
}

export default compose(
  connect(mapStateToProps),
  withRouter,
  graphql(currentLessonQuery, {
    options: (ownProps) => {
      const courseId = ownProps.selectedCourse._id
      return ({
        variables: { courseId },
        fetchPolicy: 'network-only'
      })
    }
  }),
  graphql(lessonWatchedMutationSchema, lessonWatchedMutationParams)
)(Lecture)
