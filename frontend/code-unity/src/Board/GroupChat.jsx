import React from 'react';
import { ChatWindow } from './ChatWindow';
import { QBcreateSession, QBgetGroupChats } from '@/QuickBlox';

class GroupChat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [], 
			activeIndex: 0
		};
	}

	componentDidMount() {
		QB.createSession({ login: "testuser", password: "testuser" }, (err, res) => {
			if (res) {
				QBgetGroupChats(res.token)
					.then(chats => {
						let projects = [];
						chats.items.map(item => { projects.push({ id: item._id, name: item.name }); });
						this.setState({ projects: projects });
					});

				QB.chat.connect({ userId: res.user_id, password: "testuser" }, (err, roster) => {
					if (err) console.log(err);
				});
			} else {
				console.log(err);
			}
		});
	}

	changeActive(index, e) {
		console.log(index);
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
					<h1 className="h4">Group Chat</h1>
				</div>
				<div className="row">

					{/*left bar*/}
					<div className="col-md-4 border-right project-chat-sidebar">
						{
							this.state.projects.map((project, index) => {
								return <a className={"project-chat-item " + (index == 0 && "active")} key={project.id} id={project.id} onClick={this.changeActive.bind(this, index)}>{project.name}</a>
							})
						}
					</div>

					{/*Message page*/}
					<div className="col-md-8">
						<ChatWindow />
					</div>
				</div>
			</div>
		);
	}

}

export { GroupChat };