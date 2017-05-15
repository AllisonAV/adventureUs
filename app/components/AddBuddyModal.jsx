import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import SetClass from 'react-classset'
import firebase from 'APP/fire'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'
import moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard'

export default class AddBuddyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pendingBuddies: {}, // there's nothing on state when we go to the buddies tab
      clipboard: `https://tern-2b37d.firebaseapp.com${window.location.pathname}`,
      copied: ''
    }
    this.closeModal = this.closeModal.bind(this)
  }
  componentDidMount() {
    this.listenTo(this.props.tripRef.child('pendingBuddies'))
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentWillReceiveProps(incoming, outgoing) {
    this.listenTo(incoming.tripRef.child('pendingBuddies'))
  }
  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      this.setState({ pendingBuddies: snapshot.val() })
    })
    this.unsubscribe = () => ref.off('value', listener)
  }
  closeModal(e) {
    // console.log('Add buddy modal x click', e)
    document.getElementById('addBuddyModal').style.display = 'none'
  }
  makeNewBuddy = () => {
    const newBuddyEmail = document.getElementById('newBuddyEmail').value
    var hasPendingBuddies = this.props.tripRef
      .once('value')
      .then(snapshot => {
        snapshot.child('pendingBuddies').exists()
      })

    if (hasPendingBuddies) {
      this.props.tripRef.child('pendingBuddies').push({
        // this creates a uid for each pending buddy
        // the uid is a key, the value is {email: newBuddyEmail}
        email: newBuddyEmail
      })
    } else {
      this.props.tripRef
        .update({
          // this creates a uid for each pending buddy
          // the uid is a key, the value is {email: newBuddyEmail}
          pendingBuddies: {
            email: newBuddyEmail
          }
        })
    }
    this.refs.input.value = ''
  }
  render() {
    return this.state.pendingBuddies ? (
      <div className="modal" id="addBuddyModal">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close"
                onClick={this.closeModal}
                >&times;
                  </button>
              <h4 className="modal-title">Follow these steps:</h4>
            </div>
            <div className="modal-body">
              <div>
                Under construction:  Let's map over the pendingBuddies emails here!!
              </div>
              <span
                style={{
                  fontWeight: 'bold'
                }}>
                Step 1: </span>
              <span> Enter your buddy's e-mail here: </span>
              <div className="modal-add-buddy">
                <input
                  ref="input"
                  className="modal-add-buddy-input form-control"
                  placeholder="Buddy's e-mail"
                  type="text"
                  id="newBuddyEmail" />
                <button
                  className="modal-add-buddy-button"
                  type="button"
                  className="btn btn-primary"
                  onClick={this.makeNewBuddy}
                >Invite</button>
              </div>
              <span
                style={{
                  fontWeight: 'bold'
                }}>
                Step 2: </span>
              <span> Share this link with your buddy: </span>
              <div className="modal-add-buddy">
                <input
                  className="modal-add-buddy form-control"
                  style={{
                    fontSize: '11px'
                  }}
                  value={this.state.clipboard} />
              </div>

              <CopyToClipboard text={this.state.clipboard}
                onCopy={() => this.setState({ copied: true })}>
                <button
                  className="modal-add-buddy-button"
                  type="button"
                  className="btn btn-primary"
                  style={{
                    width: '100%'
                  }}
                >Copy to clipboard</button>
              </CopyToClipboard>
              {this.state.copied ? <div><p style={{ color: '#18bc9c', padding: '5px' }}>Copied.</p></div> : null}
            </div>
          </div>
        </div>
      </div>
      ) :
      null
  }
}
