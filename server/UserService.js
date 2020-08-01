const User = require('./models/User')
const ChatRoom = require('./models/ChatRoom')

async function get(req, res) {
  try {
    var logged_in = req.isAuthenticated()
    if(logged_in){
      var userTA = req.user.tutorAvailability
      while(true){
        if(userTA.length===0) break;
        if(userTA[0] < new Date().getTime() + 86400000) userTA.shift();
        else break;
      }
      var userA = req.user.appointments
      var userPA = req.user.pastAppointments
      while(true){
        if(userA.length===0) break;
        if(userA[0][0] < new Date().getTime()-3600000) {
          userPA.splice(0,0,userA.shift());
        } else break;
      }
      if (userTA.length < req.user.tutorAvailability.length || userA.length < req.user.appointments.length) {
        req.user.tutorAvailability = userTA;
        req.user.appointments = userA;
        req.user.pastAppointments = userPA;
        req.user.save();
      }
      var user_data = {
        logged_in: logged_in,
        _id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        image: req.user.image,
        hours: req.user.hours,
        grade: req.user.grade,
        contacts: req.user.contacts,
        contacts_data: req.user.contacts_data,
        subjects: req.user.subjects,
        bio: req.user.bio,
        tutorAvailability: userTA,
        appointments: req.user.appointments,
      }
      res.json(user_data);
      updateContactsData(req, res);
    } else res.json({})
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function updateContactsData(req, res) {
  try {
    var i = 0; 
    while (i < req.user.contacts.length){
      if(i === req.user.contacts.length) break;
      await User.findById(req.user.contacts[i], async (err, user) => {
        if (err) {
          console.log(err);
        } else {
          if (!req.user.contacts_data.has(user._id.toString())) {
            let chatRoom = await ChatRoom.findOne({members: [user._id.toString(), req.user._id.toString()]})
            if (!chatRoom) chatRoom = await ChatRoom.create({members: [req.user._id.toString(), user._id.toString()]})
            const contact_data = {
              displayName: user.displayName,
              firstName: user.firstName,
              lastName: user.lastName,
              image: user.image,
              chatRoom: await chatRoom._id,
            }
            req.user.contacts_data.set(user._id.toString(), contact_data);
          } else {
            const contact_data = {
              displayName: user.displayName,
              firstName: user.firstName,
              lastName: user.lastName,
              image: user.image,
              chatRoom: req.user.contacts_data.get(user._id.toString()).chatRoom,
            }
            req.user.contacts_data.set(user._id.toString(), contact_data);
          }
        }
      })
      i++;
    }
    req.user.save();
  } catch (err) {
    console.log(err)
  }
}

function getPastAppointments(req, res) {
  try {
    var logged_in = req.isAuthenticated()
    if(logged_in){
      res.json(req.user.pastAppointments)
    } else res.json({})
  } catch (err) {
    console.error(err)
    res.status(500).send(err);
  }
}

function getWithID(req, res) {
  try {
    let id = req.params.id;
    User.findById(id, (err, user) => {
      if (err) {
        res.json({user_dne: true});
      } else {
        var userTA = user.tutorAvailability
        while(true){
          if(userTA.length===0) break;
          if(userTA[0] < new Date().getTime() + 86400000) userTA.shift();
          else break;
        }
        var userA = user.appointments
        var userPA = user.pastAppointments
        while(true){
          if(userA.length===0) break;
          if(userA[0][0] < new Date().getTime()-3600000) {
            userPA.splice(0,0,userA.shift());
          } else break;
        }
        if (userTA.length < user.tutorAvailability.length || userA.length < user.appointments.length) {
          user.tutorAvailability = userTA;
          user.appointments = userA;
          user.pastAppointments = userPA;
          user.save();
        }
        if (userTA.length < user.tutorAvailability.length) {
          user.tutorAvailability = userTA;
          user.save();
        }
        var user_data = {
          _id: user._id,
          displayName: user.displayName,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          hours: user.hours,
          grade: user.grade,
          contacts: user.contacts,
          subjects: user.subjects,
          bio: user.bio,
          tutorAvailability: user.tutorAvailability,
          appointments: user.appointments,
        }
        res.json(user_data)
      }
    });
  } catch (err) {
    console.error(err)
    res.status(500).send(err);
  }
}

function update(req, res) {
  try{
    req.user.displayName = req.body.displayName || req.user.displayName;
    req.user.firstName = req.body.firstName || req.user.firstName;
    req.user.lastName = req.body.lastName || req.user.lastName;
    req.user.image = req.body.image || req.user.image;
    req.user.hours = req.body.hours || req.user.hours;
    req.user.grade = req.body.grade || req.user.grade;
    req.user.contacts = req.body.contacts || req.user.contacts;
    req.user.subjects = req.body.subjects;
    req.user.bio = req.body.bio || req.user.bio;
    req.user.tutorAvailability = req.body.tutorAvailability || req.user.tutorAvailability,
    req.user.save();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports = { get, updateContactsData, getPastAppointments, getWithID, update };