import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Route, Switch } from 'react-router-dom'

// actions
import { toggleSideBar } from '../../actions/sidebar-actions/sidebar-actions'
import { setUploadImage } from '../../actions/upload-actions/upload-actions'
import { showNotification } from 'actions/notification-actions/notification-actions'
import { setCollageMode, resetCollageMemes, addOrRemoveMemeFromCollage } from 'actions/collage-actions/collage-actions'
import { signOut } from 'actions/user-actions/user-actions'

// components
import Avatar from 'components/Avatar/Avatar'
import Button from 'components/Button/Button'
import Title from 'components/Title/Title'
import TextLink from 'components/TextLink/TextLink'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import DropZone from 'components/DropZone/DropZone'
import Text from 'components/Text/Text'
import Icon from 'components/Icon/Icon'
import Generator from 'containers/Generator/Generator'
import Cropper from 'components/Cropper/Cropper'
import Searcher from 'containers/Searcher/Searcher'

//  services
import AnalyticsService from 'services/Analytics'

// helpers
import helpers from 'helpers/helpers'
import { blobToString } from 'containers/Generator/generator-helpers'

// config
import config from 'config/config'


class Home extends Component {

    createCleanSlate = () => {
        const mockId = helpers.uniqueId()

        this.props.history.push(`/generator/clean-slate/${mockId}/normalFormat`)
        AnalyticsService.sendEvent('Clean slate')
    }

    uploadImage = (selectedFiles) => {

        const { setUploadImage, history, addOrRemoveMemeFromCollage, showNotification } = this.props

        if (_.size(selectedFiles) > 3) {
            return showNotification({ message: 'אפשר להעלות עד 3 ממים לקולאז׳' })
        }

        if (_.size(selectedFiles) > 1) {

            const promises = _.map(selectedFiles, file => {
                return blobToString({ blob: file }).then(image => {
                    return addOrRemoveMemeFromCollage({ meme: { id: helpers.uniqueId(), urlPath: image } })
                })
            })

            Promise.all(promises).then(() => {
                history.push('/generator/collage/collage-meme/normalFormat')
            })

            return
        }

        const blob = _.head(selectedFiles)
        const uploadedMemeId = helpers.uniqueId()

        blobToString({ blob }).then(urlPath => {
            setUploadImage({ urlPath, id: uploadedMemeId }).then(() => {

                history.push(`/generator/cropper/${uploadedMemeId}/normalFormat`)

            })
        })


    }

    render() {

        const { isLoggedIn, signOut } = this.props
       
        return (
            <div className="home">

                {!helpers.isMobile() && <Searcher className="margin-top-small"/>}

                <Avatar isCentered className="margin-top-medium"/>

                <Title className="margin-top-small main-title margin-bottom-large">
                    מימ קינג
                </Title>


                <Grid>
                    <Row>

                        <Col xs={10} xsOffset={1} smOffset={3} sm={6} className="padding-right-none padding-left-none">
                            <Button
                                bsSize="lg"
                                className="flex space-between align-items-center margin-bottom-none margin-top-small"
                                onDrop={this.uploadImage}
                                componentClass={DropZone}
                                multiple
                            >
                                <Text className="margin-bottom-none margin-top-none" weight={600}>
                                    העלאת תמונה
                                </Text>
                                <Icon className="pull-left" name="UPLOAD"/>

                            </Button>

                            <Button
                                onClick={this.createCleanSlate}
                                icon="STOP"
                                className="flex space-between align-items-center margin-top-small"
                                block
                                bsSize="lg"
                            >
                                <Text
                                    className="margin-bottom-none margin-top-none flex space-between align-items-center"
                                    weight={600}>
                                    לוח חלק
                                </Text>
                                <Icon className="pull-left" name="STOP"/>
                            </Button>
                        </Col>

                    </Row>

                </Grid>

                <Switch>
                    <Route path={`/generator/:type/:id/:format`} component={Generator}/>
                </Switch>

                <div className="personal-messages-links text-center">
                    <TextLink to="bugs-page">
                        <small>בקשות ודיווח על באגים</small>
                    </TextLink>
                    {!isLoggedIn && (
                        <TextLink className="margin-right-small" to="sign-in">
                            <small>התחברות</small>
                        </TextLink>
                    )}
                    {!isLoggedIn && (
                        <TextLink className="margin-right-small" to="sign-up">
                            <small>הרשמה</small>
                        </TextLink>
                    )}

                    {isLoggedIn && (
                        <TextLink className="margin-right-small" to="" onClick={signOut}>
                            <small>התנתקות</small>
                        </TextLink>
                    )}

                    {(isLoggedIn && !helpers.isMobile()) && (
                        <TextLink className="margin-right-small" to="settings">
                            <small>הגדרות</small>
                        </TextLink>
                    )}
                    <TextLink className="box-text-link margin-right-small" to="suggest-memes">
                        <small>הוספת מם למאגר</small>
                    </TextLink>
                </div>

                <div className="text-center margin-top-small">
                    <a
                        style={{ color: 'white', direction: 'ltr', textDecoration: 'underline' }}
                        href={helpers.isMobile() ? undefined : 'https://www.facebook.com/nir.benyair'}
                    >

                        <small> המחולל נבנה ע״י

                            Nir Ben-Yair@
                        </small>
                    </a>

                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        isLoggedIn: state.auth.authenticated,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleSideBar,
        setUploadImage,
        setCollageMode,
        signOut,
        showNotification,
        resetCollageMemes,
        addOrRemoveMemeFromCollage
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

