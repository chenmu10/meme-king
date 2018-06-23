import React from 'react';
import classNames from 'classnames';
import { addStyle } from 'react-bootstrap/lib/utils/bootstrapUtils';
import PropTypes from 'prop-types';

// components
import BootstrapButton from 'react-bootstrap/lib/Button';
import ActivityIndicator from 'components/ActivityIndicator/ActivityIndicator';

addStyle(BootstrapButton, 'brand');
addStyle(BootstrapButton, 'brand-gray-border');

const Button = ({ onClick, className, children, isLoading, ...rest }) => {

    return (
        <BootstrapButton className={classNames("box-cta-button", className)} onClick={onClick} {...rest}>
            {
                isLoading
                    ?
                <ActivityIndicator className="center-block" />
                    :
                children
            }
        </BootstrapButton>
    )
}

Button.defaultProps = {
    size: 'md',
    bsStyle: 'brand'
};

Button.propTypes = {
    bsStyle: PropTypes.oneOf([ 'brand', 'default', 'brand-gray-border' ])
}


export default Button;
