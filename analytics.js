(() => {
    // Public Web Analytics site token, not an account API key.
    const cloudflareSiteToken = '51b49f1650944f1dbd905e0e333badee';
    const isPublishedSite = window.location.protocol === 'https:' &&
        window.location.hostname === 'supriyapong.github.io' &&
        window.location.pathname.startsWith('/my-portfolio/');

    if (!isPublishedSite || !/^[a-f0-9]{32}$/i.test(cloudflareSiteToken)) return;

    const beacon = document.createElement('script');
    beacon.type = 'module';
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    beacon.dataset.cfBeacon = JSON.stringify({ token: cloudflareSiteToken });
    beacon.addEventListener('load', () => {
        const note = document.getElementById('website-analytics-note');
        if (note) note.hidden = false;
    });
    document.body.appendChild(beacon);
})();
