import React from 'react';
import { ChatWindow } from './ChatWindow';
import { QBgetGroupChats } from '@/QuickBlox';

class GroupChat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			activeIndex: 0,
			isLoading: false,
			disableChatChange: false
		};
	}

	componentDidMount() {
		this.setState({ isLoading: true });
		QB.createSession({ login: "testuser", password: "testuser" }, (err, res) => {
			if (res) {
				QBgetGroupChats()
					.then(chats => {
						let projects = [];
						chats.items.map(item => { projects.push({ id: item._id, name: item.name }); });
						this.setState({ projects: projects, isLoading: false });
					});

				QB.chat.connect({ userId: res.user_id, password: "testuser" }, (err, roster) => {
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

	changeActive(index, e) {
		if (this.state.disableChatChange) return;
		this.setState({ activeIndex: index });
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
					<h1 className="h4">Group Chat</h1>
				</div>
				<div className="row">
					{(this.state.isLoading && <div className="d-flex spinner-border text-dark mx-auto mt-5 p-3"></div>)}
					{/* left bar */}
					{!this.state.isLoading &&
						<div className="col-md-4 border-right project-chat-sidebar">
							{
								this.state.projects.map((project, index) => {
									return <a className={"project-chat-item " + (this.state.activeIndex == index && "active")} key={project.id} id={project.id} onClick={this.changeActive.bind(this, index)}>{project.name}</a>
								})
							}
						</div>
					}

					{/* Message page */}
					{!this.state.isLoading && this.state.projects.length !==0 &&
						<div className="col-md-8">
							<ChatWindow project_id={this.state.projects[this.state.activeIndex].id} disableChange={this.disableChatChange.bind(this)} undisableChange={this.undisableChatChange.bind(this)} />
						</div>
					}
				</div>
			</div>
		);
	}

}

export { GroupChat };