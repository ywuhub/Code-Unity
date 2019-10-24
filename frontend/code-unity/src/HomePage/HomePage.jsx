import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import { userService, authenticationService } from '@/_services';
import { Dashboard, GroupList, GroupChat } from '@/Board';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            users: null
        };
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

    render() {
        const { currentUser, users } = this.state;
        return (
            <div class="container-fluid">
                <div class="row">
                <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                  <div class="sidebar-sticky">
                    <ul class="nav flex-column">
                      <li class="nav-item">
                       <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                          <span>Infomations</span>
                          <a class="d-flex align-items-center text-muted" href="#">
                            <span data-feather="plus-circle"></span>
                          </a>
                        </h6>
                        <a class="nav-link active" href="/groupchat">
                          <span data-feather="home"></span>
                          Group Chat <span class="sr-only">(current)</span>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="file"></span>
                          Friends
                          <span class="badge badge-pill bg-light align-text-bottom">27</span>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="shopping-cart"></span>
                          Massages
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="shopping-cart"></span>
                          My profile
                        </a>
                      </li>
                    </ul>

                    <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                      <span>Group infos</span>
                      <a class="d-flex align-items-center text-muted" href="#">
                        <span data-feather="plus-circle"></span>
                      </a>
                    </h6>
                    <ul class="nav flex-column mb-2">
                      <li class="nav-item">
                        <a class="nav-link" href="/groupList">
                          <span></span>
                        Group List
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="file-text"></span>
                        Temp
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="file-text"></span>
                          Temp
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#">
                          <span data-feather="file-text"></span>
                          Temp
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>

                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
                <Switch>
                    <Route path="/grouplist" component={GroupList} />
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/groupchat" component={GroupChat} />
                </Switch>

                  {/*<h2>Section title</h2>
                  <div class="table-responsive">
                    <table class="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Header</th>
                          <th>Header</th>
                          <th>Header</th>
                          <th>Header</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1,001</td>
                          <td>Lorem</td>
                          <td>ipsum</td>
                          <td>dolor</td>
                          <td>sit</td>
                        </tr>
                        <tr>
                          <td>1,002</td>
                          <td>amet</td>
                          <td>consectetur</td>
                          <td>adipiscing</td>
                          <td>elit</td>
                        </tr>
                        <tr>
                          <td>1,003</td>
                          <td>Integer</td>
                          <td>nec</td>
                          <td>odio</td>
                          <td>Praesent</td>
                        </tr>
                        <tr>
                          <td>1,003</td>
                          <td>libero</td>
                          <td>Sed</td>
                          <td>cursus</td>
                          <td>ante</td>
                        </tr>
                        <tr>
                          <td>1,004</td>
                          <td>dapibus</td>
                          <td>diam</td>
                          <td>Sed</td>
                          <td>nisi</td>
                        </tr>
                        <tr>
                          <td>1,005</td>
                          <td>Nulla</td>
                          <td>quis</td>
                          <td>sem</td>
                          <td>at</td>
                        </tr>
                        <tr>
                          <td>1,006</td>
                          <td>nibh</td>
                          <td>elementum</td>
                          <td>imperdiet</td>
                          <td>Duis</td>
                        </tr>
                        <tr>
                          <td>1,007</td>
                          <td>sagittis</td>
                          <td>ipsum</td>
                          <td>Praesent</td>
                          <td>mauris</td>
                        </tr>
                        <tr>
                          <td>1,008</td>
                          <td>Fusce</td>
                          <td>nec</td>
                          <td>tellus</td>
                          <td>sed</td>
                        </tr>
                        <tr>
                          <td>1,009</td>
                          <td>augue</td>
                          <td>semper</td>
                          <td>porta</td>
                          <td>Mauris</td>
                        </tr>
                        <tr>
                          <td>1,010</td>
                          <td>massa</td>
                          <td>Vestibulum</td>
                          <td>lacinia</td>
                          <td>arcu</td>
                        </tr>
                        <tr>
                          <td>1,011</td>
                          <td>eget</td>
                          <td>nulla</td>
                          <td>Class</td>
                          <td>aptent</td>
                        </tr>
                        <tr>
                          <td>1,012</td>
                          <td>taciti</td>
                          <td>sociosqu</td>
                          <td>ad</td>
                          <td>litora</td>
                        </tr>
                        <tr>
                          <td>1,013</td>
                          <td>torquent</td>
                          <td>per</td>
                          <td>conubia</td>
                          <td>nostra</td>
                        </tr>
                        <tr>
                          <td>1,014</td>
                          <td>per</td>
                          <td>inceptos</td>
                          <td>himenaeos</td>
                          <td>Curabitur</td>
                        </tr>
                        <tr>
                          <td>1,015</td>
                          <td>sodales</td>
                          <td>ligula</td>
                          <td>in</td>
                          <td>libero</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>*/}
                </main>
                </div>
            </div>
        );
    }
}

export { HomePage };