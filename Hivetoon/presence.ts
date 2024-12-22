const presence = new Presence({ clientId: "1319951896114630756" }),
	timePassed = Math.floor(Date.now() / 1e3);

const enum Assets {
	Logo = "https://i.imgur.com/d6zLvtC.png",
}

const pageDetails: Record<string, { details: string; state?: string }> = {
	"/home": { details: "Home Page", state: "Browsing comics to read" },
	"/series": { details: "Browsing through series' list" },
	"/redeem": { details: "On the redeem page" },
	"/memberships": { details: "On the memberships page" },
	"/auth/signin": { details: "Signing in" },
	"/auth/signup": { details: "Signing up" },
	"/bookmarks": { details: "Viewing bookmarks" },
};

function capitalizeWords(str: string): string {
	return str
		.split(" ")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

presence.on("UpdateData", async () => {
	const { pathname } = window.location,
		presenceData: PresenceData = {
			largeImageKey: Assets.Logo,
			startTimestamp: timePassed,
		},
		page = pageDetails[pathname],
		chapterMatch = pathname.match(/^\/series\/([^/]+)\/chapter-(\d+)$/),
		seriesMatch = pathname.match(/^\/series\/([^/]+)$/);

	if (chapterMatch) {
		presenceData.details = `Reading: ${capitalizeWords(
			chapterMatch[1].replace(/-/g, " ")
		)}`;
		presenceData.state = `Chapter: ${chapterMatch[2]}`;
	} else if (seriesMatch) {
		presenceData.details = `Viewing: ${capitalizeWords(
			seriesMatch[1].replace(/-/g, " ")
		)}`;
		presenceData.state = "Reading comic info";
	} else if (page) {
		presenceData.details = page.details;
		if (page.state) presenceData.state = page.state;
	} else {
		presenceData.details = "Unknown page";
		presenceData.state = "Browsing";
	}

	presence.setActivity(presenceData);
});
