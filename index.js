// https://bills.parliament.nz/api/data/v1/search

// { 	"documentPreset": 11, 	"keyword": null, 	"selectCommittee": null, 	"itemType": null, 	"itemSubType": null, 	"status": [], 	"documentTypes": [], 	"beforeCommittee": null, 	"billStage": null, 	"billStages": [], 	"billTab": null, 	"billId": "e52e16e3-0427-4372-a650-4eb655b4c440", 	"includeBillStages": null, 	"subject": null, 	"person": null, 	"parliament": null, 	"dateFrom": null, 	"dateTo": null, 	"datePeriod": null, 	"restrictedFrom": null, 	"restrictedTo": null, 	"terminatedReason": null, 	"terminatedReasons": [], 	"column": 4, 	"direction": 1, 	"pageSize": {{ $item(0).$node["Set page number"].json["records"] }}, 	"page": {{ $item(0).$node["Set page number"].json["page"] + $runIndex }} }

const url = 'https://bills.parliament.nz/api/data/v1/search';

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		documentPreset: 11,
		keyword: null,
		selectCommittee: null,
		itemType: null,
		itemSubType: null,
		status: [],
		documentTypes: [],
		beforeCommittee: null,
		billStage: null,
		billStages: [],
		billTab: null,
		billId: 'e52e16e3-0427-4372-a650-4eb655b4c440',
		includeBillStages: null,
		subject: null,
		person: null,
		parliament: null,
		dateFrom: null,
		dateTo: null,
		datePeriod: null,
		restrictedFrom: null,
		restrictedTo: null,
		terminatedReason: null,
		terminatedReasons: [],
		column: 4,
		direction: 1,
		pageSize: 1000,
		page: 0,
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
	console.log(data);
	return data;
}

getBills();
