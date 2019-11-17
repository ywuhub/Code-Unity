import React from 'react';
import { ChatWindow } from './ChatWindow';
import { QBgetGroupChats } from '@/QuickBlox';
import { authenticationService } from '@/_services';

class GroupChat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			activeIndex: 0,
			activeProjectID: 0,
			noChat: true,
			isLoading: false,
			disableChatChange: false
		};
	}

	componentDidMount() {
		this.setState({ isLoading: true });
		const curr_id = authenticationService.currentUserValue.uid;
		QB.createSession({ login: curr_id, password: curr_id }, (err, res) => {
			if (res) {
				QBgetGroupChats()
					.then(chats => {
						if (chats.total_entries !== 0) {
							let projects = [];
							chats.items.map(item => { projects.push({ id: item._id, name: item.name }); });	// item.name === {"name"=>"", "project_id"=>""}
							const project_json = JSON.parse(projects[0].name.replace(/"=>"/g, '": "'));
							this.setState({ projects: projects, activeProjectID: project_json.project_id, isLoading: false, noChat: false });
						} else {
							this.setState({ isLoading: false });
						}
					});

				QB.chat.connect({ userId: res.user_id, password: curr_id }, (err, roster) => {
					if (err) console.log(err);
				});
			} else {
				console.log(err);
			}
		});
	}

	disableChatChange() {
		this.setState({ disableChatChange: true });
	}

	undisableChatChange() {
		this.setState({ disableChatChange: false });
	}

	changeActive(index, project_id, e) {
		if (this.state.disableChatChange) return;
		this.setState({ activeIndex: index, activeProjectID: project_id });
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
					<h1 className="h4">Group Chat</h1>
				</div>
				{
					!this.state.isLoading && this.state.noChat &&
					<h4>You are not a part of any group chats. Ask your group leader to add you.</h4>
				}
				<div className="row">
					{(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>)}
					{/* left bar */}
					{!this.state.isLoading && !this.state.noChat &&
						<div className="col-md-4 border-right project-chat-sidebar">
							{
								this.state.projects.map((project, index) => {
									const project_json = JSON.parse(project.name.replace(/"=>"/g, '": "'));
									return <a className={"project-chat-item " + (this.state.activeIndex == index && "active")} key={project.id} onClick={this.changeActive.bind(this, index, project_json.project_id)}>{project_json.name}</a>
								})
							}
						</div>
					}

					{/* Message page */}
					{!this.state.isLoading && this.state.projects.length !==0 && !this.state.noChat && 
						<div className="col-md-8">
							<ChatWindow chat_id={this.state.projects[this.state.activeIndex].id} project_id={this.state.activeProjectID} disableChange={this.disableChatChange.bind(this)} undisableChange={this.undisableChatChange.bind(this)} />
						</div>
					}
				</div>
			</div>
		);
	}

}

export { GroupChat };