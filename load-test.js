import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Test target configuration.
// Change TARGET_URL from the CLI with: k6 run -e TARGET_URL=https://your-site.com load-test.js
const TARGET_URL = __ENV.TARGET_URL || 'https://example.com';

// Custom metrics for a clearer business-friendly report.
export const errorRate = new Rate('custom_error_rate');
export const successfulRequests = new Rate('custom_success_rate');
export const pageLoadTime = new Trend('custom_page_load_time');

// k6 execution profile:
// - 100 concurrent virtual users
// - sustained traffic for 5 minutes
export const options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    // Fail if 95% of requests are not faster than 500ms.
    http_req_duration: ['p(95)<500'],

    // Fail if more than 1% of requests fail at the HTTP layer.
    http_req_failed: ['rate<0.01'],

    // Fail if the custom status-based error rate is above 1%.
    custom_error_rate: ['rate<0.01'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

// Main virtual-user journey.
// Each VU repeatedly requests the target URL and records response quality.
export default function () {
  const response = http.get(TARGET_URL, {
    tags: {
      page: 'home',
    },
  });

  // Validate that the website returns a successful HTTP response.
  const statusOk = response.status >= 200 && response.status < 400;
  const responseTimeOk = response.timings.duration < 500;

  // Run checks for response correctness and latency visibility.
  check(response, {
    'status is 2xx or 3xx': () => statusOk,
    'response time under 500ms': () => responseTimeOk,
  });

  // Record custom success/error metrics for readable reporting.
  errorRate.add(!statusOk);
  successfulRequests.add(statusOk);
  pageLoadTime.add(response.timings.duration);

  // Short pause to keep behavior closer to real users instead of tight-loop hammering.
  sleep(1);
}

// Convert selected k6 summary values into a compact JSON object.
function buildReport(data) {
  const metric = (name) => data.metrics[name]?.values || {};

  return {
    targetUrl: TARGET_URL,
    testProfile: {
      virtualUsers: options.vus,
      duration: options.duration,
    },
    responseTime: {
      averageMs: metric('http_req_duration').avg,
      medianMs: metric('http_req_duration').med,
      p90Ms: metric('http_req_duration')['p(90)'],
      p95Ms: metric('http_req_duration')['p(95)'],
      p99Ms: metric('http_req_duration')['p(99)'],
      maxMs: metric('http_req_duration').max,
    },
    throughput: {
      requestsPerSecond: metric('http_reqs').rate,
      totalRequests: metric('http_reqs').count,
      dataReceivedBytes: metric('data_received').count,
      dataSentBytes: metric('data_sent').count,
    },
    reliability: {
      httpFailureRate: metric('http_req_failed').rate,
      customErrorRate: metric('custom_error_rate').rate,
      customSuccessRate: metric('custom_success_rate').rate,
    },
    thresholds: data.thresholds,
  };
}

// Format nullable k6 metric values safely for readable output.
function formatNumber(value, digits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : '0.00';
}

// Convert k6 rate values from decimals to percentages.
function formatPercent(rate) {
  return `${formatNumber(Number(rate || 0) * 100)}%`;
}

// Escape dynamic values before inserting them into the HTML report.
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Build a self-contained HTML report without external dependencies.
function buildHtmlReport(report) {
  const rows = [
    ['Target URL', report.targetUrl],
    ['Virtual users', report.testProfile.virtualUsers],
    ['Duration', report.testProfile.duration],
    ['Total requests', report.throughput.totalRequests],
    ['Requests / second', formatNumber(report.throughput.requestsPerSecond)],
    ['Average response time', `${formatNumber(report.responseTime.averageMs)} ms`],
    ['Median response time', `${formatNumber(report.responseTime.medianMs)} ms`],
    ['p90 response time', `${formatNumber(report.responseTime.p90Ms)} ms`],
    ['p95 response time', `${formatNumber(report.responseTime.p95Ms)} ms`],
    ['p99 response time', `${formatNumber(report.responseTime.p99Ms)} ms`],
    ['Max response time', `${formatNumber(report.responseTime.maxMs)} ms`],
    ['Data received', `${formatNumber(report.throughput.dataReceivedBytes, 0)} bytes`],
    ['Data sent', `${formatNumber(report.throughput.dataSentBytes, 0)} bytes`],
    ['HTTP failure rate', formatPercent(report.reliability.httpFailureRate)],
    ['Custom error rate', formatPercent(report.reliability.customErrorRate)],
    ['Custom success rate', formatPercent(report.reliability.customSuccessRate)],
  ];

  const htmlRows = rows
    .map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`)
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>k6 Load Test Summary</title>
    <style>
      body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #f8fafc; }
      main { max-width: 920px; margin: 0 auto; padding: 32px 20px; }
      .header { padding: 24px; border-radius: 8px; color: white; background: #111827; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { margin: 0; color: #cbd5e1; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin: 18px 0; }
      .card, table { background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05); }
      .card { padding: 16px; }
      .label { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
      .value { margin-top: 8px; font-size: 22px; font-weight: 800; }
      table { width: 100%; border-collapse: collapse; overflow: hidden; }
      th, td { padding: 13px 16px; border-bottom: 1px solid #e2e8f0; text-align: left; }
      th { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #64748b; background: #f8fafc; }
      tr:last-child td { border-bottom: 0; }
    </style>
  </head>
  <body>
    <main>
      <section class="header">
        <h1>k6 Load Test Summary</h1>
        <p>${escapeHtml(report.targetUrl)} - ${escapeHtml(report.testProfile.virtualUsers)} VUs - ${escapeHtml(report.testProfile.duration)}</p>
      </section>
      <section class="grid">
        <div class="card"><div class="label">p95 response</div><div class="value">${formatNumber(report.responseTime.p95Ms)} ms</div></div>
        <div class="card"><div class="label">Throughput</div><div class="value">${formatNumber(report.throughput.requestsPerSecond)} req/s</div></div>
        <div class="card"><div class="label">Error rate</div><div class="value">${formatPercent(report.reliability.customErrorRate)}</div></div>
      </section>
      <table>
        <thead><tr><th>Metric</th><th>Value</th></tr></thead>
        <tbody>${htmlRows}</tbody>
      </table>
    </main>
  </body>
</html>`;
}

// Generate detailed reports after the test finishes.
// Outputs:
// - stdout: console JSON summary
// - summary.json: machine-readable report
// - summary.html: browser-friendly report
export function handleSummary(data) {
  const report = buildReport(data);

  return {
    stdout: JSON.stringify(report, null, 2),
    'summary.json': JSON.stringify(report, null, 2),
    'summary.html': buildHtmlReport(report),
  };
}
