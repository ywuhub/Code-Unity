import React from 'react';
import { ChatWindow } from './ChatWindow';
import { authenticationService } from '@/_services';
import { QBgetGroupChats } from '@/QuickBlox';

class GroupChat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			activeIndex: 0,
			activeProjectID: 0,
			activeTitle: '',
			noChat: true,
			isLoading: false, 
			disable: false
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
							this.setState({ projects: projects, activeProjectID: project_json.project_id, activeTitle: project_json.name, noChat: false });
						} 
					})
					.then(response => {
						this.setState({ isLoading: false });
					})
			} else {
				console.log(err);
			}
		});
	}

	disableChatChange() {
		this.setState({ disable: true });
	}

	enableChatChange() {
		this.setState({ disable: false });
	}

	changeActive(index, project_id, project_name, e) {
		if (this.state.disable) return;
		this.setState({ activeIndex: index, activeProjectID: project_id, activeTitle: project_name });
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
						<div className="col-lg-4 border-right project-chat-sidebar">
							{
								this.state.projects.map((project, index) => {
									const project_json = JSON.parse(project.name.replace(/"=>"/g, '": "'));
									return <a className={(this.state.disable && "text-muted") + " project-chat-item " + (this.state.activeIndex == index && "active")} key={project.id} onClick={this.changeActive.bind(this, index, project_json.project_id, project_json.name)} >{project_json.name}</a>
								})
							}
						</div>
					}

					{/* Message page */}
					{!this.state.isLoading && this.state.projects.length !==0 && !this.state.noChat && 
						<div className="col-lg-8 container">
							<ChatWindow chat_id={this.state.projects[this.state.activeIndex].id} project_id={this.state.activeProjectID} project_title={this.state.activeTitle} disableChatChange={this.disableChatChange.bind(this)} enableChatChange={this.enableChatChange.bind(this)} />
						</div>
					}
				</div>
			</div>
		);
	}

}

export { GroupChat };