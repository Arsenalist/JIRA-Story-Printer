chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if (!isStoryPage()) {
  		alert("Easy there, Columbo, this isn't a story page.");
  		return;
  	}
  	var storyTemplate = getTemplate('templates/story.html');
  	var template = _.template(storyTemplate);
  	console.log("log is ");
  	var x = getIssueInfo();
  	console.log("x is ", x);
  	$('html').html(template(getIssueInfo()));
  	setTaskBoxHeights();

  });



function isStoryPage() {
	var type = $('#type-val').justText();	
	return type == 'Story'
}

function setTaskBoxHeights() {
	var boxes = $('.task-well');
	var maxHeight = Math.max.apply(
	  Math, boxes.map(function() {
	    return $(this).height();
	}).get());
	boxes.height(maxHeight);
}
function getTemplate(template) {
	var text;
  	$.ajax(chrome.extension.getURL(template), {async: false}).done(function(responseText) {
  		text = responseText;
  	});
  	return text;
}

function getIssueInfo() {
	return {
		'story': getStoryInfo(),
		'tasks': getTasks()
	}
}

function getStoryInfo() {
	var toStripFromDescription = /Click to add description/g
	return {
		'key': $('#key-val').justText().split('-')[1],
		'summary': $('#summary-val').justText(),
		'description': $('#description-val .user-content-block').html().replace(toStripFromDescription, ''),
		'points': $('strong[title="Story Points"]').next().justText(),
		'assumptions': $('strong[title="Assumptions"]').next().find('.flooded').html(),
		'constraints': $('strong[title="Constraints"]').next().find('.flooded').html(),
		'acceptanceCriteria': $('strong[title="Acceptance Criteria"]').next().find('.flooded').html(),
		'assignee': $('#assignee-val .user-hover').justText(),
		'epic': $('strong[title="Epic Link"]').next().find('a').justText(),
		'estimate': $('#tt_aggregate_values_orig').justText()
	}
}

function getTasks() {
	var tasks = [];
	$('#issuetable > tbody > tr').each(function(idx, tr) {
		var tr = $(tr);
		var estimate = tr.find('img[title*="Original Estimate"]').attr('alt');
		var task = {
			'key': tr.attr('data-issuekey').split('-')[1],
			'summary': tr.find('td.stsummary a').justText(),
			'assignee': tr.find('td.assignee span a').justText(),
			'estimate': estimate ? estimate.split('-')[1] : null
			
		};
		tasks.push(task);
	});
	return tasks;
}


jQuery.fn.justText = function() {
   
    return $(this).clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();
 
};

