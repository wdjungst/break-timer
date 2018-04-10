import React, { Fragment } from 'react';
import { Button, Divider, Form } from 'semantic-ui-react';
import styled from 'styled-components';

const Bg = styled.div`
height: 100vh;
background-color: #551A8B;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`

const Timer = styled.h1`
color: #fff;
font-size: 6rem;
`

class App extends React.Component {
	state = { time: null, breakEnd: null, breakOver: false, showForm: false, customTime: 5 }

	startTimer = (breakLength) => {
		const timeInMinutes = breakLength || 10
		const currentTime = Date.parse(new Date());
		const breakEnd = new Date(currentTime + timeInMinutes * 60 * 1000)
		this.setState({ breakEnd, breakOver: false }, () => {
			this.clock = setInterval( () => {
				this.calcTime()
			}, 1000)
		});
	}

  toggleForm = () => {
    this.setState( state => this.setState({ showForm: !state.showForm }) )
  }

	pad = (time) => {
		const regex = new RegExp(/^\d$/)
		if (regex.test(time.toString()))
			return `0${time}`
		return time
	}

	calcTime = () => {
		const { breakEnd } = this.state;
		const time = Date.parse(breakEnd) - Date.parse(new Date());
		const seconds = Math.floor((time/1000) % 60);
		const minutes = Math.floor((time/1000/60) % 60);
		if (minutes === 0 && seconds === 0) {
			this.setState({ breakOver: true, time: null }, () => { 
				clearInterval(this.clock)
			});
		} else {
			this.setState({ time: `${this.pad(minutes)}:${this.pad(seconds)}` })
		}
	}

  setTime = () => {
    const { customTime } = this.state;
    this.startTimer(customTime)
    this.setState({ customTime: 5, showForm: false })
  }

	render() {
		const { time, breakOver, showForm, customTime } = this.state;

		return (
      <Fragment>
			  <Bg>
			  	<Divider hidden />
			  	{ time ? 
			  	<Fragment>
			  		<Timer>Break!</Timer>
			  		<Timer>{time}</Timer>   
			  	</Fragment>
			  		:
			  		<Button.Group>
			  			<Button 
			  				basic 
			  				inverted 
			  				onClick={() => this.startTimer(10)}
			  			>
			  				Standard Break
			  			</Button>
			  			<Button.Or />
			  			<Button 
			  				basic 
			  				inverted 
			  				onClick={() => this.startTimer(15)}
			  			>
			  				Extendend Break
			  			</Button>
			  			<Button.Or />
              <Button
                basic
                inverted
                onClick={this.toggleForm}
              >
                Custom Break
              </Button>
			  		</Button.Group>
			  	}
          { showForm &&
            <Form onSubmit={this.setTime}>
              <Form.Input
                type="number"
                min="1"
                step="1"
                defaultValue={customTime}
                onChange={ e => this.setState({ customTime: e.target.value }) }
                autoFocus
                label="Enter A Duration"
              />
            </Form>
          }
			  	{ breakOver && <Timer>Break Over!</Timer> }
			  </Bg>
      </Fragment>
		);
	}
}

export default App;
