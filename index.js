import rake from 'rake-js';
import {reporter} from 'vfile-reporter';
import {toString} from 'nlcst-to-string';
import {unified} from 'unified';
import retextEnglish from 'retext-english';
import retextEquality from 'retext-equality';
import retextIndefiniteArticle from 'retext-indefinite-article';
import retextContractions from 'retext-contractions';
import retextDiacritics from 'retext-diacritics';
import retextStringify from 'retext-stringify';
import retextPos from 'retext-pos';
import retextKeywords from 'retext-keywords';
import retextReadability from 'retext-readability';
import retextRepeatedWords from 'retext-repeated-words';
import retextSentenceSpacing from 'retext-sentence-spacing';
import retextRedundantAcronyms from 'retext-redundant-acronyms';
import retextSpell from 'retext-spell';
import retextOveruse from 'retext-overuse';
import retextUsage from 'retext-usage';
import dictionary from 'dictionary-en-gb';
import {removeStopwords} from 'stopword';

const url = 'https://bills.parliament.nz/api/data/v1/search';
const fileurl = 'https://www.parliament.nz';

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		documentPreset: 11,
		// keyword: null,
		// selectCommittee: null,
		// itemType: null,
		// itemSubType: null,
		// status: [],
		// documentTypes: [],
		// beforeCommittee: null,
		// billStage: null,
		// billStages: [],
		// billTab: null,
		billId: 'e52e16e3-0427-4372-a650-4eb655b4c440',
		// includeBillStages: null,
		// subject: null,
		// person: null,
		// parliament: null,
		// dateFrom: null,
		// dateTo: null,
		// datePeriod: null,
		// restrictedFrom: null,
		// restrictedTo: null,
		// terminatedReason: null,
		// terminatedReasons: [],
		// column: 4,
		// direction: 1,
		pageSize: 999999,
		// page: 1,
	}),
};

async function getBills() {
	const response = await fetch(url, options);
	if (!response.ok) {
		// throw new Error(`HTTP error! status: ${response.status}`);
		console.error(`HTTP error! status: ${response.status}`);
		console.error(response);
		return;
	}
	const data = await response.json();
	console.log(data.results);
	return data;
}

getBills();
