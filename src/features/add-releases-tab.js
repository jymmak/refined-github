import select from 'select-dom';
import {h} from 'dom-chef';
import * as icons from '../libs/icons';
import * as pageDetect from '../libs/page-detect';

const repoUrl = pageDetect.getRepoURL();

function appendReleasesCount(count) {
	if (!count) {
		return;
	}

	select('.reponav-releases').append(<span class="Counter">{count}</span>);
}

async function cacheReleasesCount() {
	const releasesCountCacheKey = `${repoUrl}-releases-count`;

	if (pageDetect.isRepoRoot()) {
		const releasesCount = select('.numbers-summary a[href$="/releases"] .num').textContent.trim();
		appendReleasesCount(releasesCount);
		browser.storage.local.set({[releasesCountCacheKey]: releasesCount});
	} else {
		const items = await browser.storage.local.get(releasesCountCacheKey);

		appendReleasesCount(items[releasesCountCacheKey]);
	}
}

export default () => {
	if (select.exists('.reponav-releases')) {
		return;
	}

	const releasesTab = (
		<a href={`/${repoUrl}/releases`} class="reponav-item reponav-releases" data-hotkey="g r">
			{icons.tag()}
			<span> Releases </span>
		</a>
	);

	select('.reponav-dropdown').before(releasesTab);

	cacheReleasesCount();

	if (pageDetect.isReleases()) {
		releasesTab.classList.add('js-selected-navigation-item', 'selected');
		select('.reponav-item.selected')
			.classList.remove('js-selected-navigation-item', 'selected');
	}
};
