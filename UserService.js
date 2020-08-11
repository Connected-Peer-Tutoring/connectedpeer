const User = require('./models/User');

async function get(req, res) {
  try {
    // check authentication state
    var logged_in = req.isAuthenticated();
    if (logged_in) {
      // delete old tutor availability
      var userTA = req.user.tutorAvailability;
      while (true) {
        if (userTA.length === 0) break;
        if (userTA[0] < new Date().getTime() + 86400000) userTA.shift();
        else break;
      }
      // move old appointments to past appointments
      var userA = req.user.appointments;
      var userPA = req.user.pastAppointments;
      while (true) {
        if (userA.length === 0) break;
        if (userA[0][0] < new Date().getTime() - 3600000) {
          if (userA[0][2] === req.user._id.toString()) req.user.hours++;
          userPA.splice(0, 0, userA.shift());
        } else break;
      }
      if (
        userTA.length < req.user.tutorAvailability.length ||
        userA.length < req.user.appointments.length
      ) {
        req.user.tutorAvailability = userTA;
        req.user.appointments = userA;
        req.user.pastAppointments = userPA;
        req.user.save();
      }
      // sends user_data as json
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
        chat_passwords: req.user.chat_passwords,
        subjects: req.user.subjects,
        bio: req.user.bio,
        tutorAvailability: userTA,
        appointments: req.user.appointments
      };
      res.json(user_data);
    } else res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

function updateContactsData(user, callback) {
  function getContactData(i) {
    return new Promise((res) => {
      User.findById(user.contacts[i], async (err, contact) => {
        if (err) {
          console.log(err);
        } else {
          // gets chat room for user if new contact
          if (!user.contacts_data.has(contact._id.toString())) {
            let chatRoom = await ChatRoom.findOne({
              members: [user._id.toString(), contact._id.toString()].sort()
            });
            // makes new chat room if nonexistant
            if (!chatRoom)
              chatRoom = await ChatRoom.create({
                members: [user._id.toString(), contact._id.toString()].sort(),
                password: Math.random().toString(36).substring(2)
              });
            // updates contact data and chat for contact
            const contact_data = {
              displayName: contact.displayName,
              firstName: contact.firstName,
              lastName: contact.lastName,
              image: contact.image,
              chatRoom: chatRoom._id
            };
            await user.chat_passwords.set(
              chatRoom._id.toString(),
              chatRoom.password
            );
            await user.contacts_data.set(contact._id.toString(), contact_data);
            res();
          } else {
            // updates contact data
            const contact_data = {
              displayName: contact.displayName,
              firstName: contact.firstName,
              lastName: contact.lastName,
              image: contact.image,
              chatRoom: await user.contacts_data.get(contact._id.toString())
                .chatRoom
            };
            if (user.contact_data !== contact_data) {
              await user.contacts_data.set(
                contact._id.toString(),
                contact_data
              );
              res();
            } else {
              res();
            }
          }
        }
      });
    });
  }

  let promises = [];
  for (var i = 0; i < user.contacts.length; i++) {
    promises.push(getContactData(i));
  }
  Promise.all(promises).then(async () => {
    await user.save();
    callback();
  });
}

// returns past appointments (not sent with normal user_data)
function getPastAppointments(req, res) {
  try {
    var logged_in = req.isAuthenticated();
    if (logged_in) {
      res.json(req.user.pastAppointments);
    } else res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

// gets user data through user's id (function nearly identical to get())
function getWithID(req, res) {
  try {
    let id = req.params.id;
    User.findById(id, (err, user) => {
      if (!user) {
        res.json({ user_dne: true });
      } else {
        var userTA = user.tutorAvailability;
        while (true) {
          if (userTA.length === 0) break;
          if (userTA[0] < new Date().getTime() + 86400000) userTA.shift();
          else break;
        }
        var userA = user.appointments;
        var userPA = user.pastAppointments;
        while (true) {
          if (userA.length === 0) break;
          if (userA[0][0] < new Date().getTime() - 3600000) {
            userPA.splice(0, 0, userA.shift());
          } else break;
        }
        if (
          userTA.length < user.tutorAvailability.length ||
          userA.length < user.appointments.length
        ) {
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
          tutorAvailability: userTA.filter((v) => {
            return !(
              userA.flat().indexOf(v) >= 0 ||
              userA.flat().indexOf(v - 1800000) >= 0 ||
              userA.flat().indexOf(v + 1800000) >= 0
            );
          })
        };
        res.json(user_data);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

// updates user information
function update(req, res) {
  try {
    req.user.displayName = req.body.displayName || req.user.displayName;
    req.user.firstName = req.body.firstName || req.user.firstName;
    req.user.lastName = req.body.lastName || req.user.lastName;
    req.user.grade = req.body.grade || req.user.grade;
    req.user.subjects = req.body.subjects;
    req.user.bio = req.body.bio || req.user.bio;
    (req.user.tutorAvailability =
      req.body.tutorAvailability || req.user.tutorAvailability),
      req.user.save();
    for (var i = 0; i < req.user.contacts; i++) {
      User.findById(req.user.contacts[i], (err, user) => {
        if (user) updateContactsData(user, () => {});
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports = {
  get,
  updateContactsData,
  getPastAppointments,
  getWithID,
  update
};
