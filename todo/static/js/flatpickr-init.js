document.addEventListener('DOMContentLoaded', () => {
  // Get the default date from the selected_date input
  const selectedDateInput = document.querySelector('input[name="selected_date"]');
  const defaultDateRange = selectedDateInput.value
    ? selectedDateInput.value.split(' - ') // Split the range into start and end dates
    : []; // Default to an empty array if no value is provided

  // Initialize Flatpickr
  flatpickr('.datepicker', {
    mode: 'range',
    static: true,
    monthSelectorType: 'static',
    dateFormat: 'M j, Y',
    prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    defaultDate: defaultDateRange, // Set the default date range
    onReady: (selectedDates, dateStr, instance) => {
      // Update the input value on calendar initialization
      instance.element.value = dateStr.replace('to', '-');
      const customClass = instance.element.getAttribute('data-class');
      instance.calendarContainer.classList.add(customClass);
    },
    onChange: (selectedDates, dateStr, instance) => {
      // Update the input value when the date is changed
      instance.element.value = dateStr.replace('to', '-');
    },
  });
});
