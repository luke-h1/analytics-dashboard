import AnalyticsDashboard from "@frontend/components/AnalyticsDashboard";
import { analytics } from "@frontend/utils/analytics";
import { getDate } from "@frontend/utils/date";

const AnalyticsPage = async () => {
  const TRACKING_DAYS = 7;
  const pageViews = await analytics.retrieveDays("pageView", TRACKING_DAYS);

  // go into each day, each event, and sum the values
  const totalPageViews = pageViews.reduce((acc, curr) => {
    return (
      acc +
      curr.events.reduce((acc, curr) => {
        return acc + Object.values(curr)[0]!;
      }, 0)
    );
  }, 0);

  const avgVisitorsPerDay = (totalPageViews / TRACKING_DAYS).toFixed(1);

  const amtVisitorsToday = pageViews
    .filter((ev) => ev.date === getDate())
    .reduce((acc, curr) => {
      return (
        acc +
        curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0)
      );
    }, 0);

  const topCountriesMap = new Map<string, number>();

  for (let i = 0; i < pageViews.length; i += 1) {
    const day = pageViews[0];
    if (!day) {
      continue;
    }

    for (let j = 0; j < day.events.length; j += 1) {
      const event = day.events[j];
      if (!event) {
        continue;
      }
      const key = Object.keys(event)[0]!;
      const value = Object.values(event)[0]!;

      const parsedKey = JSON.parse(key);
      const { country } = parsedKey;

      if (country) {
        if (topCountriesMap.has(country)) {
          const prevValue = topCountriesMap.get(country)!;
          topCountriesMap.set(country, prevValue + value);
        } else {
          topCountriesMap.set(country, value);
        }
      }
    }
  }

  const topCountries = [...topCountriesMap.entries()]
    .sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      } else {
        return 1;
      }
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen w-full py-12 flex justify-center items-center">
      <div className="relative w-full max-w-6xl mx-auto text-white">
        <AnalyticsDashboard
          avgVisitorsPerDay={avgVisitorsPerDay}
          amtVisitorsToday={amtVisitorsToday}
          topCountries={topCountries}
          timeseriesPageviews={pageViews}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
