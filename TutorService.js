const TutorTimes = require('./models/TutorTimes');
const User = require('./models/User');

// posts tutor availability; creates new tutor time object if first post for time
async function post(req, res) {
  try {
    // updates user subjects and bio info
    req.user.subjects = req.body.subjects.sort(
      (a, b) => SubjectList.indexOf(a) - SubjectList.indexOf(b)
    );
    req.user.bio = req.body.bio;
    (req.user.tutorAvailability = req.body.tutorAvailability.sort()),
      req.user.save();

    for (var i = 0; i < req.body.tutorAvailability.length; i++) {
      let tutorTime = await TutorTimes.findOne({
        time: req.body.tutorAvailability[i]
      });

      if (tutorTime) {
        if (tutorTime.tutors.indexOf(req.user._id) < 0) {
          tutorTime.tutors.push(req.user._id);
          tutorTime.save();
        }
      } else {
        tutorTime = new TutorTimes({
          time: req.body.tutorAvailability[i],
          tutors: [req.user._id]
        });
        tutorTime.save();
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

// returns tutor search result by page, subject, and time availabilty
async function getTutors(req, res) {
  try {
    var tutorIDs = [];
    var i = 0;
    var t = 0;

    while (tutorIDs.length < 8) {
      if (i === req.body.q.time.length) {
        return res.json({ tutorIDs: tutorIDs, hasMore: false });
      }

      let tutorTime = await TutorTimes.findOne({ time: req.body.q.time[i] });

      if (tutorTime) {
        if (req.body.page * 8 >= t + tutorTime.tutors.length) {
          i++;
          t = t + tutorTime.tutors.length;
          continue;
        } else {
          tutors = tutorTime.tutors;
          for (
            var j = req.body.page * 8 - t;
            j < tutorTime.tutors.length;
            j++
          ) {
            User.findById(tutorTime.tutors[j], (err, tutor) => {
              if (err || tutor === null) {
                tutors.splice(tutors.indexOf(tutorTime.tutors[j]), 1);
              } else {
                if (!tutor.tutorAvailability.indexOf(req.body.q.time[i])) {
                  tutors.splice(tutors.indexOf(tutorTime.tutors[j]), 1);
                } else {
                  var subjectsFilterMet = true;
                  for (var k = 0; k < req.body.q.subjects.length; k++) {
                    if (tutor.subjects.indexOf(req.body.q.subjects[k]) < 0) {
                      subjectsFilterMet = false;
                      break;
                    }
                  }
                  if (
                    subjectsFilterMet &&
                    tutor.appointments
                      .flat()
                      .indexOf(req.body.q.time[i] - 1800000) &&
                    tutor.appointments.flat().indexOf(req.body.q.time[i]) &&
                    tutor.appointments
                      .flat()
                      .indexOf(req.body.q.time[i] + 1800000)
                  ) {
                    tutorIDs.push(tutor._id);
                    if (tutorIDs.length === 8) {
                      return res.json({ tutorIDs: tutorIDs, hasMore: true });
                    }
                  }
                }
              }
            });
          }
          i++;
          t = t + tutorTime.tutors.length;
          if (tutors.length < tutorTime.tutors.length) {
            tutorTime.tutors = tutors;
            tutorTime.save();
          }
        }
      } else {
        i++;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
}

const SubjectList = [
  'Math',
  'Algebra',
  'Algebra 2',
  'Geometry',
  'Precalculus',
  'AP Statistics',
  'Calculus',
  'AP Calculus AB',
  'AP Calculus BC',
  'AP Economics Micro',
  'AP Economics Macro',
  'Biology',
  'AP Biology',
  'AP Enviromental Science',
  'Chemistry',
  'AP Chemistry',
  'Physics',
  'AP Physics 1',
  'AP Physics 2',
  'AP Physics C',
  'English',
  'AP English Lang',
  'AP English Lit',
  'AP Psychology',
  'History',
  'AP Human Geography',
  'AP US History',
  'AP European History',
  'AP World History',
  'Spanish',
  'AP Spanish',
  'Chinese',
  'AP Chinese',
  'French',
  'AP French',
  'AP Computer Science P',
  'AP Computer Science A'
];

module.exports = { post, getTutors };
