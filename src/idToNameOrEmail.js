import firebase from 'APP/fire'
const db = firebase.database()
const userRef = db.ref('users/')
// NOTA BENE: RETURNS A PROMISE, YOU MUST .THEN() OFF OF IT

// when a valid UID is passed in,
// if the user entered in their name, the name is returned
// otherwise, the email is returned
export default function(uid) {
  return userRef.child(uid)
    .once('value')
    .then(snapshot => {
      const nameExists = snapshot.child('name').exists()
      return nameExists
        ?
        userRef.child(uid)
          .child('name')
          .once('value')
          .then(snapshot => snapshot.val())
        :
        userRef.child(uid)
          .child('email')
          .once('value')
          .then(snapshot => snapshot.val())
    })
    .then(result => result) // this line seems unneccessary
    .catch(err => console.error(err))
}
