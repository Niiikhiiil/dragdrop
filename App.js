import React, { Component } from 'react';
import './App.css';
// https://github.com/0xMALVEE/react-tasklist-draggable/blob/main/src/components/Todolist.js
export default class App extends Component {
	constructor() {
		super();
		this.state = {
			list: [],
			input: '',
			edit: false,
			tempid: 0,
			todoItemDrag: React.createRef(),
			todoItemDragOver: React.createRef(),
			isDragging: false,
		};
	}

	onChange = (e) => {
		this.setState({ input: e.target.value });
	};

	onAddTask = (e) => {
		e.preventDefault();
		const obj = {
			inpt: this.state.input,
			id: Date.now(),
		};
		this.setState({ list: this.state.list.concat(obj) });
		this.setState({ input: '' });
	};

	// -----------------delete---------------------------------------------------
	onDeleteItem = (itemId) => {
		this.setState({
			list: [...this.state.list].filter((item) => item.id !== itemId),
		});
	};

	// --------------------edit-----------------------------------------------

	editButton = (e) => {
		const { input, tempid, list } = this.state;

		const todos = this.state.list;
		todos.map((item) => {
			if (item.id === tempid) {
				item.inpt = input;
			}
		});

		// this.onChange();
		// todos[tempid].inpt = input;

		this.setState({ list: todos, edit: false, input: '', tempid: 0 });
	};
	handleEdit = (id) => {
		const editinput = this.state.list.find((item) => item.id === id);
		this.setState({ input: editinput.inpt, edit: true, tempid: id });
	};

	// ---------------------------------draggebale--------------------------------------
	dragStart = (e, index) => {
		this.state.todoItemDrag.current = index;
	};
	dragEnter = (e, index) => {
		this.state.todoItemDragOver.current = index;
		const cparray = this.state.list;
		let fArray = [];
		cparray.forEach((item) => {
			fArray.push({
				inpt: item.inpt,
				id: item.id,
				isDragging: false,
			});
		});

		fArray[index].isDragging = true;

		this.setState({ list: fArray });
	};
	dragEnd = (e, index) => {
		const arr1 = this.state.list;

		const todo_item_main = arr1[this.state.todoItemDrag.current];
		arr1.splice(this.state.todoItemDrag.current, 1);
		arr1.splice(this.state.todoItemDragOver.current, 0, todo_item_main);

		this.state.todoItemDrag.current = null;
		this.state.todoItemDragOver.current = null;

		let f_arr = [];

		arr1.forEach((item) => {
			f_arr.push({
				inpt: item.inpt,
				id: item.id,
				isDragging: false,
			});
		});

		this.setState({ list: f_arr });
	};
	// --------------------------------------------------------------------------------------

	render() {
		return (
			<div className="wrapper">
				<h2>ToDoList</h2>
				<div className="subwrapper">
					<input
						placeholder="type something..."
						value={this.state.input}
						onChange={(e) => this.onChange(e)}
					/>
					{this.state.edit ? (
						<button
							onClick={this.editButton}
							className="update"
						>
							Edit
						</button>
					) : (
						<button
							onClick={this.onAddTask}
							className="add"
						>
							Add
						</button>
					)}
				</div>
				<div className="list">
					{this.state.list.map((item, index) => {
						return (
							<>
								<li
									draggable
									droppable
									onDragStart={(e) =>
										this.dragStart(e, index)
									}
									onDragEnter={(e) =>
										this.dragEnter(e, index)
									}
									onDragEnd={(e) => this.dragEnd(e, index)}
									className="list"
								>
									{item.inpt}
									<button
										onClick={() =>
											this.onDeleteItem(item.id)
										}
										className="delete"
									>
										Delete
									</button>
									<button
										onClick={() => this.handleEdit(item.id)}
										className="update"
									>
										Edit
									</button>
								</li>
							</>
						);
					})}
				</div>
			</div>
		);
	}
}
