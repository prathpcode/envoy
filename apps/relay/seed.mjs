// Sample content. Every person here is fictional; none of this describes a real student.
// Each persona has a public card (offers, openTo, affiliation), private memory facts tagged by topic,
// and disclosure rules. A topic that is not listed under `hide` may be shared.

const TOPICS = ["classes", "grades", "internships", "projects", "availability", "startup", "contact"];
const P = (id, name, place, affiliation, offers, openTo, hide, facts, extra = {}) => ({
  user: { id, name, place, kind: "persona" },
  card: { userId: id, offers, openTo, affiliation },
  rules: TOPICS.map((topic) => ({ topic, share: !hide.includes(topic) && topic !== "contact" })),
  facts: Object.entries(facts).flatMap(([topic, list]) => list.map((text) => ({ topic, text }))),
  points: extra.points ?? 0, recentAccepts: extra.recentAccepts ?? 0,
});

export const YOU = {
  user: { id: "u_you", name: "You", place: "wilbur", kind: "you" },
  card: { userId: "u_you", offers: ["CS 106B section help", "Python and data analysis", "Intramural soccer"], openTo: ["study", "coffee", "teammate"], affiliation: "Wilbur Hall" },
  rules: TOPICS.map((topic) => ({ topic, share: !["grades", "contact"].includes(topic) })),
  facts: [
    { topic: "classes", text: "Taking Math 51 and CS 107 this quarter." },
    { topic: "availability", text: "Free most evenings after six, and Saturday afternoon." },
    { topic: "projects", text: "Built a course planner in Python last spring." },
    { topic: "grades", text: "Got a B-minus on the first Math 51 midterm." },
  ],
  points: 15, recentAccepts: 0,
};

export const PERSONAS = [
  P("u_maya", "Maya Chen", "roble", "Roble Hall", ["iOS and SwiftUI apps", "CS 193P", "Hackathon builds that ship"], ["teammate", "coffee", "study"], ["internships", "grades"], {
    projects: ["Shipped two SwiftUI apps to the App Store.", "Built a campus dining app that 400 people use."],
    availability: ["Free this weekend from Friday night on."],
    classes: ["Took CS 193P and CS 147."],
    internships: ["Interned on the iOS team at a fintech startup."],
    grades: ["Got an A in CS 193P."],
  }, { points: 85 }),
  P("u_dev", "Dev Okafor", "stern", "Stern Hall", ["Math 51 and linear algebra", "CS 103 proofs", "Runs a problem-set group"], ["study", "coffee"], ["grades"], {
    classes: ["Took Math 51 last year and tutors it now."],
    availability: ["Free Wednesday night and Thursday morning."],
    projects: ["Wrote a set of linear algebra review sheets people still pass around."],
    grades: ["Got an A-minus in Math 51."],
  }, { points: 120 }),
  P("u_lena", "Lena Fischer", "lagunita", "Lagunita Court", ["Robotics startup internship", "ROS and controls", "ME 210 mechatronics"], ["advice", "coffee", "cofounder"], ["startup"], {
    internships: ["Interned at a warehouse robotics startup last summer, on the controls team."],
    projects: ["Built a two-wheeled balancing robot for ME 210."],
    availability: ["Free Tuesday and Thursday afternoons."],
    startup: ["Is quietly working on a gripper idea with a labmate."],
    classes: ["Took ME 210 and CS 223A."],
  }, { points: 60 }),
  P("u_sam", "Sam Rivera", "stern", "Stern Hall", ["React Native and iOS", "Go backends", "CS 142 web apps"], ["teammate", "cofounder"], ["internships"], {
    projects: ["Built a ride-share board for the row houses in React Native."],
    availability: ["Busy Saturday, free on Sunday."],
    internships: ["Interned on a payments backend team."],
    classes: ["Took CS 142 and CS 144."],
  }, { points: 40 }),
  P("u_noor", "Noor Haddad", "toyon", "Toyon Hall", ["Linear algebra for machine learning", "CS 229", "Math 104"], ["study", "advice"], ["grades"], {
    classes: ["Took Math 104 and CS 229 last year."],
    availability: ["Has her own midterm Thursday, so only Tuesday works."],
    projects: ["Wrote a small autograd library to learn the maths."],
    grades: ["Got a B-plus in Math 104."],
  }, { points: 70 }),
  P("u_jonah", "Jonah Brooks", "branner", "Branner Hall", ["Product design", "Figma prototypes", "d.school projects"], ["teammate", "coffee"], [], {
    projects: ["Designed the onboarding for a student budgeting app."],
    availability: ["Free Saturday morning only."],
    classes: ["Took ME 101 and CS 147."],
  }, { points: 25 }),
  P("u_ines", "Inés Morales", "crothers", "Crothers Hall", ["Bio ML research", "CS 279", "Finding a lab rotation"], ["advice", "coffee", "study"], ["grades"], {
    classes: ["Took CS 279 and Bio 82."],
    projects: ["Works on protein structure models in a computational biology lab."],
    availability: ["Free most mornings before ten."],
    grades: ["Got an A in CS 279."],
  }, { points: 55 }),
  P("u_tariq", "Tariq Aziz", "flomo", "Florence Moore Hall", ["Robotics club lead", "Drone hardware", "Robotics startup perception intern"], ["advice", "teammate"], ["internships", "startup"], {
    internships: ["Interned on perception at a drone robotics startup."],
    projects: ["Leads the robotics club's autonomous drone build."],
    availability: ["Free after club meetings on Monday and Wednesday."],
    startup: ["Has an offer to join that startup full time."],
  }, { points: 45 }),
  P("u_aiko", "Aiko Tanaka", "gates", "Gates Computer Science", ["iOS accessibility", "Swift concurrency", "CS 110 teaching assistant"], ["study", "coffee"], [], {
    projects: ["Added VoiceOver support to an open-source iOS reader."],
    classes: ["Took CS 110 and CS 193P."],
    availability: ["Office hours take most weekday afternoons."],
  }, { points: 95 }),
  P("u_priya", "Priya Raman", "huang", "Huang Engineering Center", ["Econ 1 and Econ 50", "Consulting recruiting", "Case interview practice"], ["coffee", "advice"], ["internships"], {
    internships: ["Has a consulting internship lined up for the summer."],
    classes: ["Took Econ 50 and MS&E 120."],
    availability: ["Free Friday afternoons."],
  }, { points: 30 }),
  P("u_marcus", "Marcus Chen", "dschool", "d.school", ["Startup fundraising basics", "Finding a cofounder", "Pitch practice"], ["cofounder", "coffee", "advice"], ["startup"], {
    startup: ["Is raising a small pre-seed round for a logistics idea."],
    projects: ["Ran a 40-person pitch night last quarter."],
    availability: ["Free Thursday evenings."],
  }, { points: 65 }),
  P("u_eli", "Eli Novak", "tresidder", "Tresidder Union", ["Linear algebra study group", "Math 51 this quarter", "CS 106B"], ["study"], ["grades"], {
    classes: ["Is in Math 51 this quarter, same exam on Thursday."],
    availability: ["Free Wednesday evening."],
    projects: ["Keeps a shared sheet of worked Math 51 problems."],
    grades: ["Scored below the median on the first midterm."],
  }, { points: 20 }),
  P("u_ruth", "Ruth Abebe", "green", "Green Library", ["Technical writing", "CS 181 ethics", "Research methods"], ["coffee", "advice", "study"], [], {
    classes: ["Took CS 181 and PWR 2."],
    projects: ["Edits the undergraduate research journal."],
    availability: ["Usually at Green Library on weeknights."],
  }, { points: 50 }),
  P("u_kofi", "Kofi Mensah", "lagunita", "Lagunita Court", ["iOS and Android hackathon builds", "Firebase", "Hackathon teammate three times this year"], ["teammate"], [], {
    projects: ["Has built three hackathon apps this year on Firebase."],
    availability: ["Already on a team this weekend."],
  }, { points: 75, recentAccepts: 3 }),
];

export const SPOTS = ["quad", "oval", "whiteplaza", "meyer", "engquad"];
