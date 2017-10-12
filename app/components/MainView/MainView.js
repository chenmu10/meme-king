import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// containers
import MemeSection from 'containers/MemeSection/MemeSection';
import Home from 'containers/Home/Home';
import Generator from 'containers/Generator/Generator';

// components
import Cropper from 'components/Cropper/Cropper';
import Admin from 'components/Admin/Admin';

export default class MainView extends Component {

    renderCategoryPage = (props) => {

        const  { category } = props.match.params;

        return (
            <MemeSection category={category} {...props.match} />
        )
    };

    render(){
        return(
            <div style={{width: '100%', backgroundColor: '#f6f6f6', height: '100vh', overflow: 'scroll'}}>
                <Route  path='/memes/:category' render={this.renderCategoryPage}/>
                <Route  path={`/memes/:category/generator/:id/:format`} component={Generator}/>
                <Route  path={`/generator-standalone/:category/:id/:format`} render={(props) => <Generator {...props} isStandAlone={true} />}/>
                <Route  exact path='/' component={Home}/>
                <Route path={`/cropper`} component={Cropper}/>
                <Route path="/generator/:type/:format" component={Generator}/>
                <Route path="/admin" component={Admin}/>
            </div>
        )
    }
}


