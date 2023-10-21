document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {  
	
	//URL_SERVER: "https://calcicolous-moonlig1.000webhostapp.com/sinclairReader/index.php",
	URL_SERVER: "https://sinclairzxworld.com/app.php/feed",
	//URL_SERVER: "http://localhost:4321/index.php",
	
  	updateRSS: document.getElementById('updateRSS'),
	principalDiv: document.getElementById('principalDiv'),
	loader: document.getElementById('loader'),

	myModal: document.getElementById('myModal'),
	closeModalButton: document.getElementById('close-modal'),
	  
	consultationTime: 0,
	
	replaceText: function(content, key, value) {
		return content.replace("{{"+ key +"}}", value ? value : "");
	},

	replaceTemplate: function(template, object) {
		for(var key in object) {
		  template = app.replaceText(template, key, object[key]);
		}
		return template;
	},
	
	convertDate: function(unixtimestamp){	   
		// Convert timestamp to milliseconds
		let date = new Date(unixtimestamp*1000);
	   
		// Year
		let year = date.getFullYear();
	   
		// Month
		let month = date.getMonth() +1;
	   
		// Day
		let day = date.getDate();
	   
		// Hours
		let hours = date.getHours();
	   
		// Minutes
		let minutes = "0" + date.getMinutes();
	   
		// Seconds
		let seconds = "0" + date.getSeconds();
	   
		// Display date time in MM-dd-yyyy h:m:s format
		let convdataTime = day+'-'+month+'-'+year+' '+hours + ':' + minutes.substr(-2);
		
		return convdataTime;		
	},


	showErrorMsg: function() {
		app.loader.classList.add('hide');

		app.updateRSS.classList.remove('hide');

		app.myModal.style.display = "block";
	},

	closeModal: function() {
		app.myModal.style.display = "none";
	},
	
	showData: function() {
		let dataRSS = "";

		if(localStorage.getItem('_sinclairReader_Data') && 
			localStorage.getItem('_sinclairReader_Data') !== "" && localStorage.getItem('_sinclairReader_Data') !== " ") {

			dataRSS = JSON.parse(localStorage.getItem('_sinclairReader_Data'));

			app.principalDiv.innerHTML = "";

			dataRSS.forEach(function(feedRSS) {
				  
				let element = document.createElement('div');
					
				let itemFeedTemplate = document.getElementById("itemFeedTemplate").innerHTML;
				itemFeedTemplate = app.replaceTemplate(itemFeedTemplate, {
					"urlItem": feedRSS.link,
					"nameItem": feedRSS.title.replace("<![CDATA[", "").replace("]]>", ""),
					//"dateItem": app.convertDate(feedRSS.date),
					"content":  feedRSS.content.replace("<hr />", "").replace("]]>", "").replace("Statistics: ", "").replace("<a href=", "<span href=").replace("</a>", "</span>"),
					//"creator": feedRSS.creator
			  	});


				let elementItem = document.createElement('div');
				elementItem.classList.add('flex');
				elementItem.innerHTML = itemFeedTemplate;
				element.appendChild(elementItem);

				app.principalDiv.appendChild(element);
			});

		}
	},

	getData: function() {
			
		app.updateRSS.classList.add('hide');

		app.loader.classList.remove('hide');


var data = null;

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === 4) {
  	debugger;
    console.log(this.responseText);
  }
});

xhr.open("GET", app.URL_SERVER);
xhr.setRequestHeader("cache-control", "no-cache");
xhr.send(data);

/*
		try {
		  fetch(app.URL_SERVER)
		  .then(
			function(response) {		
			debugger;		
				app.loader.classList.add('hide');

				app.updateRSS.classList.remove('hide');
	
				response.text()
			  	.then(function(text) {
					localStorage.setItem('_sinclairReader_Data', text);
			  		app.showData();
			  	})
			}
		  ).catch(function(err){
		  	app.showErrorMsg();
          });
		} catch (err) {
		  	app.showErrorMsg();
		}
		*/
	},

	updateTimeConsultation: function() {
		//app.consultationTime = Math.floor(Date.now() / 1000);			
		//localStorage.setItem('_rssReader_Time', app.consultationTime);

		app.updateRSS.classList.add('hide');
		try {
			fetch(app.URL_SERVER + '/clear')
			.then(
			  function(response) {
	  
				app.loader.classList.add('hide');

				app.updateRSS.classList.remove('hide');
			  }
			).catch(function(err){
				app.showErrorMsg();
			});
		  } catch (err) {
		  	app.showErrorMsg();
		  }
	},

  	init: function() {
		app.getData();

	  	app.updateRSS.addEventListener('click', (event) => {			
			app.getData();			
		});

		app.closeModalButton.addEventListener('click', app.closeModal);  
		
		
		if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
		}		
  	}
};
