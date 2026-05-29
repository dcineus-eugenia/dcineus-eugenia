// Time zone configurations
const timezones = {
    'newyork': { name: 'America/New_York', offset: -5 },
    'losangeles': { name: 'America/Los_Angeles', offset: -8 },
    'london': { name: 'Europe/London', offset: 0 },
    'paris': { name: 'Europe/Paris', offset: 1 },
    'dubai': { name: 'Asia/Dubai', offset: 4 },
    'singapore': { name: 'Asia/Singapore', offset: 8 },
    'tokyo': { name: 'Asia/Tokyo', offset: 9 },
    'sydney': { name: 'Australia/Sydney', offset: 11 }
};

/**
 * Update all clocks with current time
 */
function updateClocks() {
    const now = new Date();
    
    Object.keys(timezones).forEach(key => {
        const timezone = timezones[key];
        const clockElement = document.getElementById(`clock-${key}`);
        
        // Create a formatter for the specific timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: timezone.name
        });
        
        const timeString = formatter.format(now);
        
        // Only update if time has changed to avoid unnecessary DOM updates
        if (clockElement.textContent !== timeString) {
            clockElement.textContent = timeString;
            clockElement.classList.add('updating');
            
            // Remove animation class after it completes
            setTimeout(() => {
                clockElement.classList.remove('updating');
            }, 300);
        }
    });
}

/**
 * Alternative method using UTC offset (if Intl API unavailable)
 */
function updateClocksWithOffset() {
    const now = new Date();
    const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    
    Object.keys(timezones).forEach(key => {
        const timezone = timezones[key];
        const clockElement = document.getElementById(`clock-${key}`);
        
        // Create time for specific timezone
        const tzTime = new Date(utcTime.getTime() + timezone.offset * 60 * 60 * 1000);
        const hours = String(tzTime.getHours()).padStart(2, '0');
        const minutes = String(tzTime.getMinutes()).padStart(2, '0');
        const seconds = String(tzTime.getSeconds()).padStart(2, '0');
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        if (clockElement.textContent !== timeString) {
            clockElement.textContent = timeString;
            clockElement.classList.add('updating');
            
            setTimeout(() => {
                clockElement.classList.remove('updating');
            }, 300);
        }
    });
}

/**
 * Initialize clocks and set update interval
 */
function initClocks() {
    // Update immediately on load
    updateClocks();
    
    // Update every second
    setInterval(updateClocks, 1000);
}

// Start the clock when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClocks);
} else {
    initClocks();
}

// Handle visibility change to optimize performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - clocks are paused implicitly
    } else {
        // Page is visible again - update immediately
        updateClocks();
    }
});