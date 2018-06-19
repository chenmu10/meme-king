import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import classNames from 'classnames'

// actions
import { toggleSideBar } from 'actions/sidebar-actions/sidebar-actions'

// components
import MenuItem from "components/SideBarItem/SideBarItem"

// constants
import menu from 'constants/menu'

// helpers
import helpers from 'helpers/helpers'

export class SideMenu extends Component {

    onClose = () => {
        if (helpers.isMobile()) {
            this.props.toggleSideBar(false)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (helpers.isMobile()) {
            const cover = document.querySelector(".cover")
            cover.style.display = nextProps.isSideBarOpen ? 'block' : 'none'
            if (nextProps.isSideBarOpen) {
                cover.onclick = () => nextProps.toggleSideBar(false)
            } else {
                cover.removeEventListener("onClick", () => nextProps.toggleSideBar(false))
            }
        }
    }


    render = () => {

        const { isSideBarOpen, isLoggedIn, isAdmin, location } = this.props
        const { onClose } = this

        const visibleMenu = _.filter({ ...menu }, item => item.isVisible({ isLoggedIn, isAdmin }))

        if (!isSideBarOpen) {
            return null
        }

        return (
            <div className={classNames('sidebar padding-top-small')}>
                <ul>
                    {_.map(visibleMenu, menuItem => {

                        const { title, path, linkText, icon } = menuItem

                        return (
                            <MenuItem
                                onClick={onClose}
                                title={title}
                                path={path}
                                linkText={linkText || title}
                                icon={icon}
                                key={_.uniqueId()}
                            />
                        )
                    })
                    }
                </ul>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {

    return {
        isSideBarOpen: state.isSideBarOpen,
        isLoggedIn: _.get(state, 'auth.authenticated'),
        isAdmin: _.get(state, 'auth.user.isAdmin'),

    }
}

export default withRouter(connect(mapStateToProps, { toggleSideBar })(SideMenu))