// Set up variables for counts and max attendees
const maxAttendees = 50;
let attendeeCount = 0;
const teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

// Get DOM elements
const checkInForm = document.getElementById("checkInForm");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");

// Helper to get and set localStorage
function loadCounts() {
  const savedAttendeeCount = localStorage.getItem("attendeeCount");
  const savedTeamCounts = localStorage.getItem("teamCounts");
  const savedAttendees = localStorage.getItem("attendees");
  attendeeCount = savedAttendeeCount ? parseInt(savedAttendeeCount, 10) : 0;
  if (savedTeamCounts) {
    const parsed = JSON.parse(savedTeamCounts);
    teamCounts.water = parsed.water || 0;
    teamCounts.zero = parsed.zero || 0;
    teamCounts.power = parsed.power || 0;
  }
  return savedAttendees ? JSON.parse(savedAttendees) : [];
}

function saveCounts(attendees) {
  localStorage.setItem("attendeeCount", attendeeCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Attendee list
let attendees = loadCounts();

// DOM for attendee list
const attendeeListDiv = document.getElementById("attendeeList");

// Update all UI elements
function updateUI() {
  attendeeCountSpan.textContent = `${attendeeCount}`;
  const percent = Math.round((attendeeCount / maxAttendees) * 100);
  progressBar.style.width = `${percent}%`;
  waterCountSpan.textContent = `${teamCounts.water}`;
  zeroCountSpan.textContent = `${teamCounts.zero}`;
  powerCountSpan.textContent = `${teamCounts.power}`;
  // Update attendee list
  attendeeListDiv.innerHTML = "";
  if (attendees.length > 0) {
    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i];
      const div = document.createElement("div");
      div.className = "attendee-row";
      div.innerHTML = `<span class="attendee-name">${attendee.name}</span> <span class="attendee-team">${attendee.teamLabel}</span>`;
      attendeeListDiv.appendChild(div);
    }
  }
}

// Find winning team
function getWinningTeam() {
  let max = Math.max(teamCounts.water, teamCounts.zero, teamCounts.power);
  if (max === 0) return "";
  if (teamCounts.water === max) return "Team Water Wise";
  if (teamCounts.zero === max) return "Team Net Zero";
  if (teamCounts.power === max) return "Team Renewables";
  return "";
}

// Initial UI update
updateUI();

// Show celebration if goal reached
function showCelebration() {
  const winningTeam = getWinningTeam();
  greeting.textContent = `🎉 Goal reached! ${winningTeam} has the most check-ins! 🎉`;
  greeting.className = "success-message";
  greeting.style.display = "block";
}

// Listen for form submission
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get attendee name and team
  const attendeeNameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const attendeeName = attendeeNameInput.value.trim();
  const teamValue = teamSelect.value;

  if (attendeeName !== "" && teamValue !== "") {
    attendeeCount = attendeeCount + 1;
    teamCounts[teamValue] = teamCounts[teamValue] + 1;

    // Team label
    let teamLabel = "";
    if (teamValue === "water") {
      teamLabel = "Team Water Wise";
    } else if (teamValue === "zero") {
      teamLabel = "Team Net Zero";
    } else if (teamValue === "power") {
      teamLabel = "Team Renewables";
    }

    // Add to attendee list
    attendees.push({
      name: attendeeName,
      team: teamValue,
      teamLabel: teamLabel,
    });

    // Save progress
    saveCounts(attendees);

    // Update UI
    updateUI();

    // Show greeting or celebration
    if (attendeeCount >= maxAttendees) {
      showCelebration();
    } else {
      greeting.textContent = `Welcome, ${attendeeName}! You have checked in for ${teamLabel}.`;
      greeting.className = "success-message";
      greeting.style.display = "block";
    }

    checkInForm.reset();
  }
});
