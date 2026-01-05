export const SITE = {
  website: "https://csuwildcat.github.io/", // GitHub Pages URL for your username
  author: "Daniel Buchner",
  profile: "https://csuwildcat.github.io/about",
  desc: "Code, distributed systems, and the web.",
  title: "Back Alley Coder",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/csuwildcat/csuwildcat.github.io/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Chicago", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
