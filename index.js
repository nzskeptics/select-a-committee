
import {existsSync, readFileSync, writeFileSync, mkdirSync} from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
// import {fromPath} from "pdf2pic";
// import Tesseract from 'tesseract.js';
import TurndownService from 'turndown';
// const turndownService = new TurndownService({headingStyle: 'atx'});
// import rake from 'rake-js';
import {reporter} from 'vfile-reporter';
// import {toString} from 'nlcst-to-string';
import {unified} from 'unified';
import retextEnglish from 'retext-english';
import retextEquality from 'retext-equality';
// import retextIndefiniteArticle from 'retext-indefinite-article';
// import retextContractions from 'retext-contractions';
// import retextDiacritics from 'retext-diacritics';
import retextStringify from 'retext-stringify';
import retextPos from 'retext-pos';
import retextKeywords from 'retext-keywords';
import retextReadability from 'retext-readability';
// import retextRepeatedWords from 'retext-repeated-words';
// import retextSentenceSpacing from 'retext-sentence-spacing';
// import retextRedundantAcronyms from 'retext-redundant-acronyms';
import retextSpell from 'retext-spell';
// import retextOveruse from 'retext-overuse';
import retextUsage from 'retext-usage';
import retextProfanities from 'retext-profanities';
import retextSentiment from 'retext-sentiment';
import dictionary from 'dictionary-en-gb';
// import {removeStopwords} from 'stopword';

async function getSubmissions(url) {
	const path = 'cache/submissions.json';
	if (existsSync(path)) return JSON.parse(readFileSync(path));
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			documentPreset: 11,
			billId: 'e52e16e3-0427-4372-a650-4eb655b4c440',
			pageSize: 999999,
		}),
	};
	const response = await fetch(url, options);
	if (!response.ok) {
		console.error(`HTTP error! status: ${response.status}`);
		console.error(response);
		return;
	}
	const data = await response.json();
	writeFileSync(path, JSON.stringify(data.results, null, '\t'));
	return data.results;
}

async function getSubmissionHTML(url, name, folder = 'html') {
	const path = `cache/${folder}/${name}.html`;
	if (existsSync(path)) return readFileSync(path, 'utf8');
	const response = await fetch(url);
	if (!response.ok) {
		console.error(`HTTP error! status: ${response.status}`);
		console.error(response);
		return;
	}
	const data = await response.text();
	writeFileSync(path, data);
	return data;
}

async function getSubmissionPDF(url, id) {
	const path = `cache/pdf/${id}.pdf`;
	if (existsSync(path)) return readFileSync(path);
	const response = await fetch(url);
	if (!response.ok) {
		console.error(`HTTP error! status: ${response.status}`);
		console.error(response);
		return;
	}
	const data = await response.arrayBuffer();
	writeFileSync(path, Buffer.from(data));
	return data;
}

async function processSubmission(data) {
	const text = await pdf(data);
	const processor = unified()
		.use(retextEnglish)
		// .use(retextEquality)
		// .use(retextIndefiniteArticle)
		// .use(retextContractions)
		// .use(retextDiacritics)
		.use(retextStringify)
		.use(retextPos)
		.use(retextKeywords)
		// .use(retextReadability)
		// .use(retextRepeatedWords)
		// .use(retextSentenceSpacing)
		// .use(retextRedundantAcronyms)
		// .use(retextSpell, dictionary)
		// .use(retextOveruse)
		// .use(retextUsage)
		.use(retextProfanities)
		.use(retextSentiment);
	const file = await processor.process(text.text);
	console.log('Report', reporter(file));
	// console.log('Keywords', file.data.keywords);
	// console.log('Overuse', file.data.overusedWords);
	// console.log('Readability', file.data.readability);
	// console.log('Spelling', file.data.spellingSuggestions);
	// console.log('Suggestions', file.data.suggestions);
	console.log('Sentiment', file.data.valence, file.data.polarity);
	// console.log('Profanities', file.data.profanities);
}

async function getAll() {
	if (!existsSync('cache')) mkdirSync('cache');
	if (!existsSync('cache/html')) mkdirSync('cache/html');
	if (!existsSync('cache/metadata')) mkdirSync('cache/metadata');
	if (!existsSync('cache/pdf')) mkdirSync('cache/pdf');
	const urls = {
		search: 'https://bills.parliament.nz/api/data/v1/search',
		page: 'https://www.parliament.nz',
		pdf: 'https://www.parliament.nz/resource/en-NZ/',
	};
	const submissions = await getSubmissions(urls.search);
	for (const submission of submissions.sort((a, b) => a.title.localeCompare(b.title))) {
		console.info(submission.title);
		submission.urls = {
			page: urls.page + submission.url,
			metadata: urls.page + '/en/document/' + submission.id + '/metadata',
			pdf: urls.pdf + submission.id,
		};
		if (!existsSync(`cache/pdf/${submission.id}.pdf`)) {
			submission.html = await getSubmissionHTML(submission.urls.page, submission.id);
			submission.metadata = await getSubmissionHTML(submission.urls.metadata, submission.id, 'metadata');
			submission.key = submission.html.match(/\/resource\/en-NZ\/[A-Z0-9_]+\/([a-z0-9]+)"/)[1];
			submission.urls.pdf += '/' + submission.key;
		}
		submission.pdf = await getSubmissionPDF(submission.urls.pdf, submission.id);
		await processSubmission(submission.pdf);
	}
}

getAll();
