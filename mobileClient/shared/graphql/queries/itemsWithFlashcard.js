import gql from 'graphql-tag'

export default gql`
    query CurrentItems {
        Items {
            _id
            flashcardId
            extraRepeatToday
            actualTimesRepeated
            flashcard
            {
                _id question answer isCasual
                image {
                    url hasAlpha
                }
                answerImage {
                    url hasAlpha
                }
            }
        }
    }
`
