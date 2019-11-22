import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import GroupPost from './GroupPost';
import { favouriteService } from '@/_services';
import { authenticationService } from '@/_services';

class Favourites extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            _id: '',
            isLoading: false,
            favourites: []
        };
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }

    componentDidMount() {
        this.isMounted_ = true;
        this.state.isLoading = true;
        favouriteService.get_favourite(authenticationService.currentUserValue.uid).then(favs => {
            this.setState({
                isLoading: false,
                favourites: favs.favourite_projects
            })
        })
    }

    render() {
        let key = -1;
        console.log(this.state.favourites);
        return (
            <div>
                <div className="my-3 p-3 bg-white rounded shadow-sm">
                    <h4 className="border-bottom border-gray pb-2 mb-0">Favourites</h4>
                    {this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>}
                    {(!this.state.favourites.length && !this.state.isLoading) && <div><br></br><center>Favourite groups to see them here.</center></div>}
                    <div>
                        {this.state.favourites.map((fav) => {
                            return <div key={key++}><GroupPost post={fav}/></div>;
                        })}
                    </div>
                </div>
            </div>
        );
    }

}

export { Favourites };