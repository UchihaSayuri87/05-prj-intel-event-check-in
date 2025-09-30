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

// Listen for form submission
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get attendee name and team
  const attendeeNameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const attendeeName = attendeeNameInput.value.trim();
  const teamValue = teamSelect.value;

  // Only proceed if both fields are filled
  if (attendeeName !== "" && teamValue !== "") {
    // Increment total attendee count
    attendeeCount = attendeeCount + 1;

    // Increment selected team's count
    teamCounts[teamValue] = teamCounts[teamValue] + 1;

    // Calculate progress percentage
    const percent = Math.round((attendeeCount / maxAttendees) * 100);

    // Update attendee count on page
    attendeeCountSpan.textContent = `${attendeeCount}`;

    // Update progress bar width
    progressBar.style.width = `${percent}%`;

    // Update correct team's count on page
    if (teamValue === "water") {
      waterCountSpan.textContent = `${teamCounts.water}`;
    } else if (teamValue === "zero") {
      zeroCountSpan.textContent = `${teamCounts.zero}`;
    } else if (teamValue === "power") {
      powerCountSpan.textContent = `${teamCounts.power}`;
    }

    // Combine name and team into welcome message
    let teamLabel = "";
    if (teamValue === "water") {
      teamLabel = "Team Water Wise";
    } else if (teamValue === "zero") {
      teamLabel = "Team Net Zero";
    } else if (teamValue === "power") {
      teamLabel = "Team Renewables";
    }

    greeting.textContent = `Welcome, ${attendeeName}! You have checked in for ${teamLabel}.`;
    greeting.className = "success-message";
    greeting.style.display = "block";

    // Reset the form fields
    checkInForm.reset();
  }
});
