// Set up variables for counts and max attendees
const maxAttendees = 50; // The goal for total check-ins
let attendeeCount = 0; // Tracks total number of attendees checked in
const teamCounts = {
  water: 0, // Tracks Team Water Wise check-ins
  zero: 0, // Tracks Team Net Zero check-ins
  power: 0, // Tracks Team Renewables check-ins
};

// Get DOM elements for updating the page
const checkInForm = document.getElementById("checkInForm");
const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");

// Load saved counts and attendee list from localStorage
function loadCounts() {
  // Get saved values from localStorage
  const savedAttendeeCount = localStorage.getItem("attendeeCount");
  const savedTeamCounts = localStorage.getItem("teamCounts");
  const savedAttendees = localStorage.getItem("attendees");
  // Restore attendee count
  attendeeCount = savedAttendeeCount ? parseInt(savedAttendeeCount, 10) : 0;
  // Restore team counts
  if (savedTeamCounts) {
    const parsed = JSON.parse(savedTeamCounts);
    teamCounts.water = parsed.water || 0;
    teamCounts.zero = parsed.zero || 0;
    teamCounts.power = parsed.power || 0;
  }
  // Restore attendee list
  return savedAttendees ? JSON.parse(savedAttendees) : [];
}

// Save counts and attendee list to localStorage
function saveCounts(attendees) {
  localStorage.setItem("attendeeCount", attendeeCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Attendee list array
let attendees = loadCounts();

// Get attendee list container from the page
const attendeeListDiv = document.getElementById("attendeeList");

// Update all UI elements on the page
function updateUI() {
  // Show total attendee count
  attendeeCountSpan.textContent = `${attendeeCount}`;
  // Calculate and show progress bar
  const percent = Math.round((attendeeCount / maxAttendees) * 100);
  progressBar.style.width = `${percent}%`;
  // Show each team's count
  waterCountSpan.textContent = `${teamCounts.water}`;
  zeroCountSpan.textContent = `${teamCounts.zero}`;
  powerCountSpan.textContent = `${teamCounts.power}`;
  // Show attendee list
  attendeeListDiv.innerHTML = "";
  if (attendees.length > 0) {
    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i];
      // Create a row for each attendee
      const div = document.createElement("div");
      div.className = "attendee-row";
      div.innerHTML = `<span class="attendee-name">${attendee.name}</span> <span class="attendee-team">${attendee.teamLabel}</span>`;
      attendeeListDiv.appendChild(div);
    }
  }
}

// Find which team has the most check-ins
function getWinningTeam() {
  let max = Math.max(teamCounts.water, teamCounts.zero, teamCounts.power);
  if (max === 0) return "";
  if (teamCounts.water === max) return "Team Water Wise";
  if (teamCounts.zero === max) return "Team Net Zero";
  if (teamCounts.power === max) return "Team Renewables";
  return "";
}

// Update the page when it first loads
updateUI();

// Show a celebration message when the goal is reached
function showCelebration() {
  const winningTeam = getWinningTeam();
  greeting.textContent = `🎉 Goal reached! ${winningTeam} has the most check-ins! 🎉`;
  greeting.className = "success-message";
  greeting.style.display = "block";
}

// Listen for form submission (when someone checks in)
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Stop the page from reloading

  // Get attendee name and team from the form
  const attendeeNameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const attendeeName = attendeeNameInput.value.trim();
  const teamValue = teamSelect.value;

  // Only continue if both fields are filled
  if (attendeeName !== "" && teamValue !== "") {
    // Increase total attendee count
    attendeeCount = attendeeCount + 1;
    // Increase the selected team's count
    teamCounts[teamValue] = teamCounts[teamValue] + 1;

    // Get the full team label for the greeting and attendee list
    let teamLabel = "";
    if (teamValue === "water") {
      teamLabel = "Team Water Wise";
    } else if (teamValue === "zero") {
      teamLabel = "Team Net Zero";
    } else if (teamValue === "power") {
      teamLabel = "Team Renewables";
    }

    // Add this attendee to the attendee list
    attendees.push({
      name: attendeeName,
      team: teamValue,
      teamLabel: teamLabel,
    });

    // Save all counts and attendee list to localStorage
    saveCounts(attendees);

    // Update everything on the page
    updateUI();

    // If the goal is reached, show celebration
    if (attendeeCount >= maxAttendees) {
      showCelebration();
    } else {
      // Otherwise, show a welcome message
      greeting.textContent = `Welcome, ${attendeeName}! You have checked in for ${teamLabel}.`;
      greeting.className = "success-message";
      greeting.style.display = "block";
    }

    // Reset the form for the next attendee
    checkInForm.reset();
  }
});
