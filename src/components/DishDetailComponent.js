import React, {Component} from 'react';
import {
	Card,
	CardImg,
	CardBody,
	CardText,
	CardTitle,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	ModalHeader, ModalBody, Label, Modal, Row, Col
} from 'reactstrap';
import { Link } from 'react-router-dom';
import {Control, Errors, LocalForm} from "react-redux-form";
import {Loading} from "./LoadingComponent";
import {baseUrl} from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger} from 'react-animation-components';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

function RenderComments({listComments, postComment, dishId}) {
	if (listComments !== undefined) {

		const comment = listComments.map((m) => {
			return (
				<div key={m.id} className="list-unstyled">
					<Stagger in>
						<Fade>
							<li>{m.comment}</li>
							<li>
								--{m.author},
								{new Intl.DateTimeFormat('en-US',{ year: 'numeric', month:'short', day: '2-digit'}).format(new Date(Date.parse(m.date)))}
							</li>
						</Fade>
					</Stagger>

				</div>
			);
		});

		return (
			<div >
				<h4>Comments</h4>
				{comment}

				<CommentForm dishId={dishId} postComment={postComment}/>

			</div>
		);
	} else {
		return <div/>;
	}
}

function RenderDish({dish}) {
	if(dish != null) {
		return(
			<div>
				<FadeTransform in transformProps={{
					exitTransform: 'scale(0.5) translateY(-50%)'
				}}>
					<Card>
						<CardImg top src={baseUrl + dish.image} alt={dish.name}/>
						<CardBody>
							<CardTitle>{dish.name}</CardTitle>
							<CardText>{dish.description}</CardText>
						</CardBody>
					</Card>
				</FadeTransform>
			</div>
		)
	}
	else {
		return (
			<div/>
		)
	}
}

const DishDetail = (props) => {
	if (props.isLoading) {
		return(
			<div className='container'>
				<div className='row'>
					<Loading/>
				</div>
			</div>
		)
	}
	else if (props.errMess){
		return(
			<div className='container'>
				<div className='row'>
					<h4>{props.errMess}</h4>
				</div>
			</div>
		)
	}
	else if (props.dish !== undefined) {
		return(
			<div className='container'>
				<div className='row'>
					<Breadcrumb>
						<BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
						<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
					</Breadcrumb>
					<div className='col-12'>
						<h3>{props.dish.name}</h3>
						<hr/>
					</div>
				</div>

				<div className='row'>
					<div className='col-12 col-md-5 m-1'>
						<RenderDish dish={props.dish}  />
					</div>
					<div className='col-12 col-md-5 m-1'>
						<RenderComments listComments={props.comments}
						                postComment={props.postComment}
						                dishId={props.dish.id}/>
					</div>
				</div>
			</div>
		)
	}
	else {
		return (
			<div/>
		)
	}
};

class CommentForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false
		};
		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		})
	}

	handleSubmit(values) {
		this.toggleModal();
		console.log('Current State is: ' + JSON.stringify(values));
		this.props.postComment(this.props.dishId, values.rating, values.author, values.message);
	}

	render() {
		return(
			<React.Fragment>

				<Button outline onClick={this.toggleModal}>
					<span className='fa fa-edit fa-lg'/>Submit Comment
				</Button>

				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<Row className='form-group'>
								<Label htmlFor='rating' md={12}>Rating</Label>
								<Col md={12}>
									<Control.select model='.rating'
									                name='rating'
									                className='form-control'>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Control.select>
								</Col>
							</Row>

							<Row className='form-group'>
								<Label htmlFor='author' md={12}>Your Name</Label>
								<Col md={12}>
									<Control.text model='.author'
									              id='author'
									              name='author'
									              placeholder='Your Name'
									              className='form-control'
									              validators={{
										              minLength: minLength(3)
										              , maxLength: maxLength(15) }} />
									<Errors className='text-danger'
									        model='.author'
									        show='touched'
									        messages={{
										        minLength: 'Must be greater than 2 characters'
										        , maxLength: 'Must be 15 characters or less' }}/>
								</Col>
							</Row>

							<Row className='form-group'>
								<Label htmlFor='feedback' md={12}>Comment</Label>
								<Col md={12}>
									<Control.textarea model='.message'
									                  id='message'
									                  name='message'
									                  rows='6'
									                  className='form-control'/>
								</Col>
							</Row>
							<Row className='form-group'>
								<Col md={{size: 10, offset: 0}}>
									<Button type='submit' color='primary'>Submit</Button>
								</Col>
							</Row>
						</LocalForm>
					</ModalBody>
				</Modal>
			</React.Fragment>

		)
	}
}

export default DishDetail;