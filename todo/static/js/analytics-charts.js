// Utility functions
const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

const formatThousands = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

// Define Chart.js default settings
Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = 500;
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.padding = 8;

// Function that generates a gradient for line charts
const chartAreaGradient = (ctx, chartArea, colorStops) => {
  if (!ctx || !chartArea || !colorStops || colorStops.length === 0) {
    return 'transparent';
  }
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  colorStops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });
  return gradient;
};

// Register Chart.js plugin to add a bg option for chart area
Chart.register({
  id: 'chartAreaPlugin',
  // eslint-disable-next-line object-shorthand
  beforeDraw: (chart) => {
    if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
      const ctx = chart.canvas.getContext('2d');
      const { chartArea } = chart;
      ctx.save();
      ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
      // eslint-disable-next-line max-len
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
      ctx.restore();
    }
  },
});

// Init #analytics-01 chart
const analyticsCard01 = () => {
  const ctx = document.getElementById('analytics-card-01');
  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const textColor = {
    light: '#9CA3AF',
    dark: '#6B7280'
  };

  const gridColor = {
    light: '#F3F4F6',
    dark: `rgba(${hexToRGB('#374151')}, 0.6)`
  };  

  const tooltipBodyColor = {
    light: '#6B7280',
    dark: '#9CA3AF'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#374151'
  };

  const tooltipBorderColor = {
    light: '#E5E7EB',
    dark: '#4B5563'
  };   

  // eslint-disable-next-line no-unused-vars
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chart_data.labels,
      datasets: [
        // Indigo line
        {
          label: 'amazon_fulfilled',          
          data: chart_data.amazon_fulfilled,
          fill: true,
          backgroundColor: function(context) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            return chartAreaGradient(ctx, chartArea, [
              { stop: 0, color: `rgba(${hexToRGB('#8470FF')}, 0)` },
              { stop: 1, color: `rgba(${hexToRGB('#8470FF')}, 0.2)` }
            ]);
          },
          borderColor: '#8470FF',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: '#8470FF',
          pointHoverBackgroundColor: '#8470FF',
          pointBorderWidth: 0,
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,       
          clip: 20,
          tension: 0.2,
        },
        {
          label: 'self_fulfilled',          
          data: chart_data.self_fulfilled,
          fill: true,
          backgroundColor: function(context) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            return chartAreaGradient(ctx, chartArea, [
              { stop: 0, color: `rgba(${hexToRGB('#87CEEB')}, 0)` },
              { stop: 1, color: `rgba(${hexToRGB('#87CEEB')}, 0.2)` }
            ]);
          },
          borderColor: '#87CEEB',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: '#87CEEB',
          pointHoverBackgroundColor: '#87CEEB',
          pointBorderWidth: 0,
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,       
          clip: 20,
          tension: 0.2,
        },
        // Gray line
        {
          label: 'input_price',
          data: chart_data.input_price,
          borderColor: `rgba(${hexToRGB('#6B7280')}, 0.25)`,
          fill: false,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: `rgba(${hexToRGB('#6B7280')}, 0.25)`,
          pointHoverBackgroundColor: `rgba(${hexToRGB('#6B7280')}, 0.25)`,
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,          
          clip: 20,
          tension: 0.2,
        },
      ],
    },
    options: {
      layout: {
        padding: 20,
      },
      scales: {      
        y: {
          beginAtZero: true,
          border: {
            display: false,
          },  
          ticks: {
            callback: (value) => formatThousands(value),
            color: darkMode ? textColor.dark : textColor.light,
          },
          grid: {
            color: darkMode ? gridColor.dark : gridColor.light,
          },   
        },
        x: {
          type: 'time',
          time: {
            parser: 'MM-DD-YYYY',
            unit: 'day',
            displayFormats: {
              month: 'MMM D',
            },
          },
          border: {
            display: false,
          },            
          grid: {
            display: false,
          },
          ticks: {
            autoSkipPadding: 48,
            maxRotation: 0,
            color: darkMode ? textColor.dark : textColor.light,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          callbacks: {
            title: () => false, // Disable tooltip title
            label: (context) => formatThousands(context.parsed.y),
          },
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,          
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      maintainAspectRatio: false,
    },
  });

  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  });
};
analyticsCard01();

// Init #analytics-02 chart
const analyticsCard02 = () => {
  const ctx = document.getElementById('analytics-card-02');
  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const tooltipBodyColor = {
    light: '#6B7280',
    dark: '#9CA3AF'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#374151'
  };

  const tooltipBorderColor = {
    light: '#E5E7EB',
    dark: '#4B5563'
  };

  // Access sales_chart_data (ensure this is defined globally or passed here)
  if (typeof sales_chart_data === 'undefined') {
    console.error("sales_chart_data is not defined!");
    return;
  }

  // Initialize the chart
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sales_chart_data.labels, // Use dynamic labels
      datasets: [
        {
          label: 'Quantity Sold', // Dataset label
          data: sales_chart_data.quantities, // Use dynamic data
          fill: true,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            return chartAreaGradient(ctx, chartArea, [
              { stop: 0, color: `rgba(${hexToRGB('#8470FF')}, 0)` },
              { stop: 1, color: `rgba(${hexToRGB('#8470FF')}, 0.2)` }
            ]);
          },
          borderColor: '#8470FF',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: '#8470FF',
          pointHoverBackgroundColor: '#8470FF',
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
          tension: 0.2,
          yAxisID: 'y-axis-quantity',
        },
        {
          label: 'GMV', // Dataset label
          data: sales_chart_data.Gmv, // Use dynamic data
          fill: true,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            return chartAreaGradient(ctx, chartArea, [
              { stop: 0, color: `rgba(${hexToRGB('#87CEEB')}, 0)` },
              { stop: 1, color: `rgba(${hexToRGB('#87CEEB')}, 0.2)` }
            ]);
          },
          borderColor: '#87CEEB',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: '#87CEEB',
          pointHoverBackgroundColor: '#87CEEB',
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
          tension: 0.2,
          yAxisID: 'y-axis-gmv',
        },
        {
          label: 'Price', // Dataset label
          data: sales_chart_data.Price, // Use dynamic data
          fill: true,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            return chartAreaGradient(ctx, chartArea, [
              { stop: 0, color: `rgba(${hexToRGB('#3EC972')}, 0)` },
              { stop: 1, color: `rgba(${hexToRGB('#3EC972')}, 0.2)` }
            ]);
          },
          borderColor: '#3EC972',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: '#3EC972',
          pointHoverBackgroundColor: '#3EC972',
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
          tension: 0.2,
          yAxisID: 'y-axis-price',
        },
      ],
    },
    options: {
      layout: {
        padding: {
          left: 20,
          right: 20,
        },
      },
      scales: {
        'y-axis-price': {
          display: true, // Show Y-axis
          beginAtZero: true,
          title: {
            display: true,
            text: 'Price', // Label for Y-axis
          },
        },
        'y-axis-gmv': {
          display: true, // Show Y-axis
          beginAtZero: false,
          position: 'right',
          title: {
            display: true,
            text: 'GMV', // Label for Y-axis
          },
          
        },
        x: {
          type: 'time',
          time: {
            parser: 'MM-DD-YYYY',
            unit: 'day', // Adjust time unit if needed
          },
          display: true, // Show X-axis
          title: {
            display: true,
            text: 'Purchase Date', // Label for X-axis
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (context) => context[0].label, // Use the label as the tooltip title
            label: (context) => `${context.parsed.y}`, // Tooltip content
          },
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
        },
        legend: {
          display: true, // Display legend
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      maintainAspectRatio: false,
    },
  });

  // Handle dark mode toggle dynamically
  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  });
};

// Initialize the chart
analyticsCard02();

// Init #analytics-03 chart
const analyticsCard03 = () => {
  const ctx = document.getElementById('analytics-card-03');
  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const textColor = {
    light: '#9CA3AF',
    dark: '#6B7280'
  };

  const gridColor = {
    light: '#F3F4F6',
    dark: `rgba(${hexToRGB('#374151')}, 0.6)`
  };

  const tooltipBodyColor = {
    light: '#6B7280',
    dark: '#9CA3AF'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#374151'
  };

  const tooltipBorderColor = {
    light: '#E5E7EB',
    dark: '#4B5563'
  }; 

  // eslint-disable-next-line no-unused-vars
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        '12-01-2022', '01-01-2023', '02-01-2023',
        '03-01-2023', '04-01-2023', '05-01-2023',
      ],
      datasets: [
        // Stack
        {
          label: 'Direct',
          data: [
            5000, 4000, 4000, 3800, 5200, 5100,
          ],
          backgroundColor: '#5D47DE',
          hoverBackgroundColor: '#4634B1',
          barPercentage: 0.7,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
        // Stack
        {
          label: 'Referral',
          data: [
            2500, 2600, 4000, 4000, 4800, 3500,
          ],
          backgroundColor: '#8470FF',
          hoverBackgroundColor: '#755FF8',
          barPercentage: 0.7,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
        // Stack
        {
          label: 'Organic Search',
          data: [
            2300, 2000, 3100, 2700, 1300, 2600,
          ],
          backgroundColor: '#B7ACFF',
          hoverBackgroundColor: '#9C8CFF',
          barPercentage: 0.7,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
        // Stack
        {
          label: 'Social',
          data: [
            4800, 4200, 4800, 1800, 3300, 3500,
          ],
          backgroundColor: '#E6E1FF',
          hoverBackgroundColor: '#D2CBFF',
          barPercentage: 0.7,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
      ],
    },
    options: {
      layout: {
        padding: {
          top: 12,
          bottom: 16,
          left: 20,
          right: 20,
        },
      },
      scales: {
        y: {
          stacked: true,
          border: {
            display: false,
          },  
          beginAtZero: true,
          ticks: {
            maxTicksLimit: 5,
            callback: (value) => formatThousands(value),
            color: darkMode ? textColor.dark : textColor.light,
          },
          grid: {
            color: darkMode ? gridColor.dark : gridColor.light,
          },
        },
        x: {
          stacked: true,
          type: 'time',
          time: {
            parser: 'MM-DD-YYYY',
            unit: 'month',
            displayFormats: {
              month: 'MMM',
            },
          },
          border: {
            display: false,
          },            
          grid: {
            display: false,
          },
          ticks: {
            autoSkipPadding: 48,
            maxRotation: 0,
            color: darkMode ? textColor.dark : textColor.light,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'analytics-card-03-legend',
        },
        tooltip: {
          callbacks: {
            title: () => false, // Disable tooltip title
            label: (context) => formatThousands(context.parsed.y),
          },
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,             
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 200,
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement('li');
          // Button element
          const button = document.createElement('button');
          button.style.display = 'inline-flex';
          button.style.alignItems = 'center';
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '12px';
          box.style.height = '12px';
          box.style.borderRadius = '9999px';
          box.style.marginRight = '8px';
          box.style.borderWidth = '3px';
          box.style.borderColor = item.fillStyle;
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.classList.add('text-gray-500', 'dark:text-gray-400');
          label.style.fontSize = '0.875rem';
          label.style.lineHeight = '1.5715';
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.scales.y.grid.color = gridColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.scales.y.grid.color = gridColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  });  
};
analyticsCard03();

// Init #analytics-04 chart
const analyticsCard04 = () => {
  const ctx = document.getElementById('analytics-card-04');
  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const textColor = {
    light: '#9CA3AF',
    dark: '#6B7280'
  };

  const gridColor = {
    light: '#F3F4F6',
    dark: `rgba(${hexToRGB('#374151')}, 0.6)`
  };

  const tooltipBodyColor = {
    light: '#6B7280',
    dark: '#9CA3AF'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#374151'
  };

  const tooltipBorderColor = {
    light: '#E5E7EB',
    dark: '#4B5563'
  };   

  // eslint-disable-next-line no-unused-vars
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        '02-01-2023', '03-01-2023', '04-01-2023', '05-01-2023',
      ],
      datasets: [
        // Blue bars
        {
          label: 'New Visitors',
          data: [
            8000, 3800, 5350, 7800,
          ],
          backgroundColor: '#8470FF',
          hoverBackgroundColor: '#755FF8',
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
        // Light blue bars
        {
          label: 'Returning Visitors',
          data: [
            4000, 6500, 2200, 5800,
          ],
          backgroundColor: '#7BC8FF',
          hoverBackgroundColor: '#67BFFF',
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      layout: {
        padding: {
          top: 12,
          bottom: 16,
          left: 20,
          right: 20,
        },
      },
      scales: {
        y: {
          type: 'time',
          time: {
            parser: 'MM-DD-YYYY',
            unit: 'month',
            displayFormats: {
              month: 'MMM',
            },
          },
          border: {
            display: false,
          },            
          grid: {
            display: false,
          },
          ticks: {
            color: darkMode ? textColor.dark : textColor.light,
          },           
        },
        x: {
          border: {
            display: false,
          },  
          ticks: {
            maxTicksLimit: 3,
            align: 'end',
            callback: (value) => formatThousands(value),
            color: darkMode ? textColor.dark : textColor.light,
          },
          grid: {
            color: darkMode ? gridColor.dark : gridColor.light,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'analytics-card-04-legend',
        },
        tooltip: {
          callbacks: {
            title: () => false, // Disable tooltip title
            label: (context) => formatThousands(context.parsed.x),
          },
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,          
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 200,
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement('li');
          // Button element
          const button = document.createElement('button');
          button.style.display = 'inline-flex';
          button.style.alignItems = 'center';
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '12px';
          box.style.height = '12px';
          box.style.borderRadius = '9999px';
          box.style.marginRight = '8px';
          box.style.borderWidth = '3px';
          box.style.borderColor = item.fillStyle;
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.classList.add('text-gray-500', 'dark:text-gray-400');
          label.style.fontSize = '0.875rem';
          label.style.lineHeight = '1.5715';
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.scales.x.ticks.color = textColor.dark;
      chart.options.scales.x.grid.color = gridColor.dark;
      chart.options.scales.y.ticks.color = textColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.scales.x.ticks.color = textColor.light;
      chart.options.scales.x.grid.color = gridColor.light;
      chart.options.scales.y.ticks.color = textColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update('none');
  }); 
};
analyticsCard04();

// Init #analytics-08 chart
const analyticsCard08 = () => {
  const ctx = document.getElementById('analytics-card-08');
  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const tooltipTitleColor = {
    light: '#1F2937',
    dark: '#F3F4F6'
  };

  const tooltipBodyColor = {
    light: '#6B7280',
    dark: '#9CA3AF'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#374151'
  };

  const tooltipBorderColor = {
    light: '#E5E7EB',
    dark: '#4B5563'
  }; 

  // eslint-disable-next-line no-unused-vars
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Desktop', 'Mobile', 'Tablet'],
      datasets: [
        {
          label: 'Sessions By Device',
          data: [
            12, 50, 38,
          ],
          backgroundColor: [
            '#8470FF',
            '#7BC8FF',
            '#4634B1',
          ],
          hoverBackgroundColor: [
            '#755FF8',
            '#67BFFF',
            '#2F227C',
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: '80%',
      layout: {
        padding: 24,
      },
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'analytics-card-08-legend',
        },
        tooltip: {
          titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
        },         
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 200,
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement('li');
          li.style.margin = '4px';
          // Button element
          const button = document.createElement('button');
          button.classList.add('btn-xs', 'bg-white', 'dark:bg-gray-700', 'text-gray-500', 'dark:text-gray-400', 'shadow-sm', 'shadow-black/[0.08]', 'rounded-full');
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.toggleDataVisibility(item.index, !item.index);
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '8px';
          box.style.height = '8px';
          box.style.backgroundColor = item.fillStyle;
          box.style.borderRadius = '2px';
          box.style.marginRight = '4px';
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.style.display = 'flex';
          label.style.alignItems = 'center';
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;      
    } else {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;      
    }
    chart.update('none');
  }); 
};
analyticsCard08();

// Init #analytics-09 chart
const analyticsCard09 = () => {
  const ctx = document.getElementById('analytics-card-09');
  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const tooltipTitleColor = {
    light: '#1F2937',
    dark: '#F3F4F6'
  };

  const tooltipBodyColor = {
    light: '#6B7280',
    dark: '#9CA3AF'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#374151'
  };

  const tooltipBorderColor = {
    light: '#E5E7EB',
    dark: '#4B5563'
  }; 

  // eslint-disable-next-line no-unused-vars
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['<18', '18-24', '24-36', '>35'],
      datasets: [
        {
          label: 'Visit By Age Category',
          data: [
            30, 50, 5, 15,
          ],
          backgroundColor: [
            '#8470FF',
            '#7BC8FF',
            '#FF5656',
            '#3EC972',
          ],
          hoverBackgroundColor: [
            '#755FF8',
            '#67BFFF',
            '#FA4949',
            '#059669',
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: '80%',
      layout: {
        padding: 24,
      },
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'analytics-card-09-legend',
        },
        tooltip: {
          titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
        },         
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 200,
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement('li');
          li.style.margin = '4px';
          // Button element
          const button = document.createElement('button');
          button.classList.add('btn-xs', 'bg-white', 'dark:bg-gray-700', 'text-gray-500', 'dark:text-gray-400', 'shadow-sm', 'shadow-black/[0.08]', 'rounded-full');
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.toggleDataVisibility(item.index, !item.index);
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '8px';
          box.style.height = '8px';
          box.style.backgroundColor = item.fillStyle;
          box.style.borderRadius = '2px';
          box.style.marginRight = '4px';
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.style.display = 'flex';
          label.style.alignItems = 'center';
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;      
    } else {
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;      
    }
    chart.update('none');
  }); 
};
analyticsCard09();

// Init #analytics-10 chart
const analyticsCard10 = () => {
  const ctx = document.getElementById('analytics-card-10');
  if (!ctx) return;

  const darkMode = localStorage.getItem('dark-mode') === 'true';

  const gridColor = {
    light: '#F3F4F6',
    dark: `rgba(${hexToRGB('#374151')}, 0.6)`
  };

  const textColor = {
    light: '#9CA3AF',
    dark: '#6B7280'
  };  

  const backdropColor = {
    light: '#ffffff',
    dark: '#1F2937'
  };  

  const tooltipTitleColor = {
    light: '#1F2937',
    dark: '#F3F4F6'
  };

  const tooltipBodyColor = {
    light: '#6B7280',
    dark: '#9CA3AF'
  };

  const tooltipBgColor = {
    light: '#ffffff',
    dark: '#374151'
  };

  const tooltipBorderColor = {
    light: '#E5E7EB',
    dark: '#4B5563'
  }; 

  // eslint-disable-next-line no-unused-vars
  const chart = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: ['Males', 'Females', 'Unknown'],
      datasets: [
        {
          label: 'Sessions By Gender',
          data: [
            500, 326, 242,
          ],
          backgroundColor: [
            `rgba(${hexToRGB('#8470FF')}, 0.8)`,
            `rgba(${hexToRGB('#7BC8FF')}, 0.8)`,
            `rgba(${hexToRGB('#3EC972')}, 0.8)`,
          ],
          hoverBackgroundColor: [
            `rgba(${hexToRGB('#755FF8')}, 0.8)`,
            `rgba(${hexToRGB('#67BFFF')}, 0.8)`,
            `rgba(${hexToRGB('#059669')}, 0.8)`,
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      layout: {
        padding: 24,
      },
      scales: {
        r: {
          grid: {
            color: darkMode ? gridColor.dark : gridColor.light,
          },
          ticks: {
            color: darkMode ? textColor.dark : textColor.light,
            backdropColor: darkMode ? backdropColor.dark : backdropColor.light,
          },
        },
      },      
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'analytics-card-10-legend',
        },
        tooltip: {
          titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
          bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
          backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
          borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
        },         
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 200,
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement('li');
          li.style.margin = '4px';
          // Button element
          const button = document.createElement('button');
          button.classList.add('btn-xs', 'bg-white', 'dark:bg-gray-700', 'text-gray-500', 'dark:text-gray-400', 'shadow-sm', 'shadow-black/[0.08]', 'rounded-full');
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.toggleDataVisibility(item.index, !item.index);
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '8px';
          box.style.height = '8px';
          box.style.backgroundColor = item.fillStyle;
          box.style.borderRadius = '2px';
          box.style.marginRight = '4px';
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.style.display = 'flex';
          label.style.alignItems = 'center';
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  document.addEventListener('darkMode', (e) => {
    const { mode } = e.detail;
    if (mode === 'on') {
      chart.options.scales.r.grid.color = gridColor.dark;
      chart.options.scales.r.ticks.color = textColor.dark;
      chart.options.scales.r.ticks.backdropColor = backdropColor.dark;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;      
    } else {
      chart.options.scales.r.grid.color = gridColor.light;
      chart.options.scales.r.ticks.color = textColor.light;
      chart.options.scales.r.ticks.backdropColor = backdropColor.light;
      chart.options.plugins.tooltip.titleColor = tooltipTitleColor.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;      
    }
    chart.update('none');
  }); 
};
analyticsCard10();    