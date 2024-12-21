const presence = new Presence({
		clientId: "1319951896114630756",
	}),
	timePassed = Math.floor(Date.now() / 1e3);

const enum Assets {
	Logo = "https://drakecomic.org/wp-content/uploads/2024/04/dragonlogo.png",
}

presence.on("UpdateData", async () => {
	const { pathname, search } = window.location,
		presenceData: PresenceData = {
			largeImageKey: Assets.Logo,
			startTimestamp: timePassed,
		};

	if (pathname.includes("list-mode"))
		presenceData.details = "Browsing the collection in list mode";
	else if (pathname === "/") presenceData.details = "On the Home page";
	else if (pathname.split("/")[1] === "manga") {
		if (pathname === "/manga/")
			presenceData.details = "Browsing the collection";
		else if (!pathname.includes("chapter")) {
			const titleElement =
				document.querySelector<HTMLHeadingElement>("h1.entry-title");

			if (titleElement && titleElement.textContent)
				presenceData.details = `Viewing: ${titleElement.textContent.trim()}`;
			else {
				presenceData.details = `Viewing ${pathname
					.split("/")[2]
					.replace(/-/g, " ")
					.replace(/\b\w/g, c => c.toUpperCase())}`;
			}
			presenceData.state = "Browsing comic details";
		}
	} else if (pathname.includes("bookmark"))
		presenceData.details = "Browsing Bookmarks";
	else if (pathname.includes("/page/")) {
		const pageMatch = pathname.match(/\/page\/(\d+)/);
		presenceData.details = `Browsing for comics. Page: ${
			pageMatch ? pageMatch[1] : "Unknown Page"
		}`;
	} else if (search.startsWith("?s=")) {
		const searchQuery = new URLSearchParams(search).get("s");
		if (!searchQuery || searchQuery.trim() === "") {
			presenceData.details = "An empty search...";
			presenceData.state = "Comics are all shown.";
		} else
			presenceData.details = `Searching: "${searchQuery.replace(/\+/g, " ")}"`;
	} else {
		const titleElement =
			document.querySelector<HTMLHeadingElement>("h1.entry-title");

		if (!titleElement) {
			const intervalId = setInterval(() => {
				const titleElement =
					document.querySelector<HTMLHeadingElement>("h1.entry-title");

				if (titleElement) {
					clearInterval(intervalId);
					presenceData.details = `Viewing: ${
						titleElement.textContent?.trim() || "Unknown Title"
					}`;
					presence.setActivity(presenceData);
				}
			}, 500);
			return;
		}

		presenceData.details = `Viewing: ${
			titleElement.textContent?.trim() || "Unknown Title"
		}`;
	}

	const chapterMatch = pathname.match(/(\d+)\/?$/);

	if (chapterMatch && !pathname.includes("/page/")) {
		let cleanTitle = pathname
			.split("/")[1]
			.replace(/-/g, " ")
			.replace(/\b\w/g, c => c.toUpperCase())
			.replace(/( -?chapter? \d+)$/i, "")
			.trim();
		cleanTitle = cleanTitle.replace(/\s+\d+$/, "").trim();

		presenceData.details = `Reading: ${cleanTitle}`;
		presenceData.state = `On Chapter ${chapterMatch[1]}`;
	}

	presence.setActivity(presenceData);
});
