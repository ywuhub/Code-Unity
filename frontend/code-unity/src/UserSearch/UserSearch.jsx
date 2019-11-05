import React from 'react';

class UserSearch extends React.Component {
    constructor(props) {
        super(props);
        this.isMounted_ = false;
        this.state = {
            initialUsers: [],
            users: [],
            isLoading: false
        };
    }

    componentWillUnmount() {
        this.isMounted_ = false;
    }
    
    componentDidMount() {
        this.isMounted_ = true;
        this.setState({ isLoading: true });
        // const options = { method:'GET', headers: {'Content-Type': 'application/json', 'Authorization': authHeader()} };
        // fetch(`${config.apiUrl}/api/users`, options)
        //     .then(response => { return response.json(); })
        //     .then(json => {
        //         if (this.isMounted_) this.setState({ tags: json });
        //     })
        //     .catch(err => { console.log(err); });
        if (this.isMounted_) {
            this.setState({
                initialUsers: [
                    {
                        user_id: 1,
                        username: "Blhadi",
                        name: "Jason Do"
                    }, 
                    {
                        user_id: 2,
                        username: "TestUsername",
                        name: "TestUser"
                    }, 
                    {
                        user_id: 3,
                        username: "RealUsername",
                        name: "RealUser"
                    }
                ]
            });
        }
    }

    handleUserInput(e) {
        let filter = e.target.value.toLowerCase();
        let users = this.state.initialUsers;
        
        if (/^(\s+|)$/.test(filter)) {
            this.setState({ users: [] }); 
            return;
        }
        let users_ = users.filter((user) => {
            return user['username'].toLowerCase().indexOf(filter) !== -1 || user['name'].toLowerCase().indexOf(filter) !== -1;
        });

        this.setState({ users: users_ });
    }

    render() {
        return (
            <div className="mx-3" style={{'width':'25vw', 'position':'relative'}}>
                <div className="input-group border-bottom">
                    <input type="text" id="user-search" className="form-control bg-transparent pr-5 pl-3 border-0" style={{'fontSize':'14px', 'color':'white' }} placeholder="Search for users" onChange={this.handleUserInput.bind(this)}></input>
                        <div className="input-group-append">
                        <div className="input-group-text bg-transparent border-0 ml-n5"><b className="fa fa-search bg-transparent"></b></div>
                    </div>
                </div>    

                <div className="btn-group-vertical pt-1" style={{ 'position': 'absolute', 'zIndex': '1', 'width': '100%' }}>
                    {
                        this.state.users.map((user) => {
                            return <button type="button" className="btn border border-black bg-light" style={{'textAlign':'left'}} key={user.user_id} >{user.username} {user.name}</button>
                        })
                        
                    }
                </div>     

                
            </div>
        );
    }
}

export {UserSearch};