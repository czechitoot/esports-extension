(() => {
  'use strict';
  // Runs in the page world solely to read the schedule model behind a match card.
  // No page code is executed, fetched, or copied into the extension.
  document.addEventListener('esports-helper:resolve-match', event => {
    const link = event.target;
    if (!(link instanceof HTMLAnchorElement) || !link.matches('[data-esports-match-link]') ||
        !/^\/(?:dashboard(?:\/.*)?)?$/i.test(location.pathname)) return;
    link.removeAttribute('href');
    const card = link.parentElement;
    if (!card?.matches('[role="button"]') || !card.closest('main')) return;
    const key = Object.keys(card).find(key => key.startsWith('__reactFiber$'));
    let fiber = key && card[key];
    if (!fiber) return;
    // React can reuse a child while replacing siblings, so a return chain's
    // root is not enough to identify its current branch. The DOM's React props
    // identify the committed host fiber directly.
    const propsKey = Object.keys(card).find(key => key.startsWith('__reactProps$'));
    const hostProps = propsKey && card[propsKey];
    if (hostProps && fiber.memoizedProps !== hostProps && fiber.alternate?.memoizedProps === hostProps) fiber = fiber.alternate;
    for (let depth = 0; fiber && depth < 30; depth++, fiber = fiber.return) {
      const props = fiber.memoizedProps;
      const model = props?.scheduleModel;
      if (!model) continue;
      // Mirror the destination in the site's schedule-card handler, including
      // leaderboard seasons that navigate to a season rather than a match.
      const season = model.SeasonWeek?.Season;
      const isSeason = season?.SeasonType?.leaderboard && season.id;
      const id = isSeason ? season.id : model.id;
      if (!/^[1-9]\d*$/.test(String(id))) return;
      link.href = new URL(isSeason ? `/seasons/view/${id}` : `/match/${id}`, location.origin).href;
      return;
    }
  });
})();
