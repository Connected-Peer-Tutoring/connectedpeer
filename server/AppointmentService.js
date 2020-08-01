const User = require('./models/User');
const { google } = require('googleapis');
const UserService = require('./UserService');

function make(req, res) {
  try {
    User.findById(req.body.appointment[2], async (err, tutor) => {
      if (err) res.json({ success: false });
      else if (tutor.tutorAvailability.indexOf(req.body.appointment[0]) < 0)
        res.json({ success: false });
      else if (
        tutor.appointments.flat().indexOf(req.body.appointment[0]) >= 0 ||
        tutor.appointments.flat().indexOf(req.body.appointment[0] - 1800000) >=
          0 ||
        tutor.appointments.flat().indexOf(req.body.appointment[0] + 1800000) >=
          0
      )
        res.json({ success: false });
      else if (
        req.user.appointments.flat().indexOf(req.body.appointment[0]) >= 0 ||
        req.user.appointments
          .flat()
          .indexOf(req.body.appointment[0] - 1800000) >= 0 ||
        req.user.appointments
          .flat()
          .indexOf(req.body.appointment[0] + 1800000) >= 0
      )
        res.json({ success: false });
      else {
        tutor.appointments.push(req.body.appointment);
        if (tutor.contacts.indexOf(req.body.appointment[1].toString()) < 0)
          tutor.contacts.unshift(req.body.appointment[1]);
        await tutor.save();
        req.user.appointments.push(req.body.appointment);
        if (req.user.contacts.indexOf(req.body.appointment[2].toString()) < 0)
          req.user.contacts.unshift(req.body.appointment[2]);
        await req.user.save();
        await UserService.updateContactsData(req, res);
        res.json({ success: true });
        var appointment = req.body.appointment;
        const serviceAccountAuth = new google.auth.GoogleAuth({
          keyFile: './config/ServiceAccountCredentials.json',
          scopes: ['https://www.googleapis.com/auth/drive']
        });
        const drive = google.drive({ version: 'v3', auth: serviceAccountAuth });
        driveRes = await drive.files.copy({
          fileId: '1S_OA9qUy5CwA1qkGxyn-buodmJHBJlsNNG7cOH-WH6Q',
          requestBody: {
            name:
              'ConnectedPeer: ' +
              req.user.firstName +
              ' and ' +
              tutor.firstName +
              "'s Jamboard"
          }
        });
        appointment[5] = driveRes.data.id;
        var sharingPerm = {
          type: 'anyone',
          role: 'writer'
        };
        drive.permissions.create({
          fileId: driveRes.data.id,
          resource: sharingPerm,
          auth: serviceAccountAuth
        });
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        oAuth2Client.setCredentials({
          access_token: req.user.accessToken,
          refresh_token: req.user.refreshToken
        });
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        var event = {
          summary:
            'ConnectedPeer: ' +
            req.user.firstName +
            ' and ' +
            tutor.firstName +
            "'s Appointment",
          location: 'ConnectedPeer',
          description:
            'Peer Tutoring session with ' +
            req.user.firstName +
            ' and ' +
            tutor.firstName +
            '.',
          start: {
            dateTime: new Date(appointment[0]),
            timeZone: 'UTC'
          },
          end: {
            dateTime: new Date(appointment[0] + 3600000),
            timeZone: 'UTC'
          },
          attendees: [{ email: tutor.email }],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 10 }
            ]
          },
          conferenceData: 'hangoutsMeet'
        };
        calendar.events.insert(
          {
            calendarId: 'primary',
            sendNotifications: true,
            resource: event,
            auth: oAuth2Client
          },
          async function (err, event) {
            if (err) {
              console.log(
                'There was an error contacting the Calendar service: ' + err
              );
              return res.json({ success: false });
            }
            appointment[3] = event.data.id;
            appointment[4] = event.data.hangoutLink;
            var tempA = req.user.appointments || [];
            tempA[tempA.length - 1] = appointment;
            req.user.appointments = tempA.sort((a, b) => a[0] - b[0]);
            req.user.contacts = req.user.contacts.sort(
              (a, b) =>
                2 ** (-1 * req.user.appointments.flat().indexOf(a)) -
                2 ** (-1 * req.user.appointments.flat().indexOf(b))
            );
            req.user.save();
            tempA = tutor.appointments || [];
            tempA[tempA.length - 1] = appointment;
            tutor.appointments = tempA.sort((a, b) => a[0] - b[0]);
            tutor.contacts = tutor.contacts.sort(
              (a, b) =>
                2 ** (-1 * tutor.appointments.flat().indexOf(a)) -
                2 ** (-1 * tutor.appointments.flat().indexOf(b))
            );
            tutor.save();
          }
        );
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

async function cancel(req, res) {
  try {
    var otherUserID =
      req.body[1].toString() === req.user._id.toString()
        ? req.body[2]
        : req.body[1];
    User.findById(otherUserID, async (err, user) => {
      if (err) res.json({ success: false });
      else {
        const oAuth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        oAuth2Client.setCredentials({
          access_token: req.user.accessToken,
          refresh_token: req.user.refreshToken
        });
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        calendar.events
          .delete({
            auth: oAuth2Client,
            calendarId: 'primary',
            eventId: req.body[3],
            sendNotifications: true
          })
          .catch((err) => console.log(err));
        var i = 0;
        while (i < req.user.appointments.length) {
          if (req.user.appointments[i][0] === req.body[0]) break;
          i++;
        }
        req.user.pastAppointments.splice(
          0,
          0,
          req.user.appointments.splice(i, 1)
        );
        req.user.save();
        i = 0;
        while (i < user.appointments.length) {
          if (user.appointments[i][0] === req.body[0]) break;
          i++;
        }
        user.pastAppointments.splice(0, 0, user.appointments.splice(i, 1));
        user.save();
        res.json({ success: true });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports = { make, cancel };
