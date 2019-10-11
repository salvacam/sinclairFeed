document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {  
	
	URL_SERVER: "https://calcicolous-moonlig.000webhostapp.com/rssReader/index.php",
	//URL_SERVER: "http://localhost:1234/back/index.php",
	
  	clearRSS: document.getElementById('clearRSS'),
  	updateRSS: document.getElementById('updateRSS'),
	modalClear: document.getElementById('modalClear'),  
	principalDiv: document.getElementById('principalDiv'),
	loader: document.getElementById('loader'),
	  
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

	clearDiv: function() {
		principalDiv.innerHTML = '';
	},
	
	showData: function() {
		let dataRSS = "";		

		if(localStorage.getItem('_rssReader_Data')) {

			app.clearDiv();

			dataRSS = JSON.parse(localStorage.getItem('_rssReader_Data'));

			dataRSS.forEach(function(feedRSS) {
				
				let nameFeedTemplate = document.getElementById("nameFeedTemplate").innerHTML;
				nameFeedTemplate = app.replaceTemplate(nameFeedTemplate, {
					"nameFeed": feedRSS.name
				  });
				  
				let element = document.createElement('div');
				element.innerHTML = nameFeedTemplate;

				feedRSS.content.forEach(function(itemRSS) {	
					
					let itemFeedTemplate = document.getElementById("itemFeedTemplate").innerHTML;
					itemFeedTemplate = app.replaceTemplate(itemFeedTemplate, {
						"urlItem": itemRSS.url,
						"nameItem": itemRSS.title.replace("<![CDATA[", "").replace("]]>", ""),
						"dateItem": app.convertDate(itemRSS.date)
				  	});

					let elementItem = document.createElement('div');
					elementItem.classList.add('flex');
					elementItem.innerHTML = itemFeedTemplate;
					element.appendChild(elementItem);
				});

				app.principalDiv.appendChild(element);
			});

		}
	},

	getData: function() {
			
		app.updateRSS.classList.add('hide');
		app.clearRSS.classList.add('hide');

		app.loader.classList.remove('hide');

		try {
		  fetch(app.URL_SERVER)
		  .then(
			function(response) {
				
				app.loader.classList.add('hide');

				app.updateRSS.classList.remove('hide');		  	
				app.clearRSS.classList.remove('hide');
	
				response.text()
			  	.then(function(text) {
					localStorage.setItem('_rssReader_Data', text);
			  		app.showData();
			  	})
			}
		  );
		} catch (err) {
		  //app.showLastData();
		}
	},

	updateTimeConsultation: function() {
		//app.consultationTime = Math.floor(Date.now() / 1000);			
		//localStorage.setItem('_rssReader_Time', app.consultationTime);

		app.updateRSS.classList.add('hide');
		app.clearRSS.classList.add('hide');
		try {
			fetch(app.URL_SERVER + '/clear')
			.then(
			  function(response) {
	  
				app.loader.classList.add('hide');

				app.updateRSS.classList.remove('hide');
				app.clearRSS.classList.remove('hide');
			  }
			);
		  } catch (err) {
			//app.showLastData();
		  }
	},

  	init: function() {  		
		/*
  		if (localStorage.getItem("_rssReader_Time") && localStorage.getItem("_rssReader_Time")!=''){
			app.consultationTime = localStorage.getItem("_rssReader_Time");
		}
		*/

		app.showData();
		  
		app.clearRSS.addEventListener('click', (event) => {
	  		app.modalClear.classList.remove('hide');

  			document.getElementById('okClear').addEventListener('click', () => {
				app.modalClear.classList.add('hide');
				localStorage.setItem('_rssReader_Data', '');
				app.clearDiv();

				app.updateTimeConsultation();

				document.getElementById('okClear').removeEventListener('click', ()=> {});
  			});

  			document.getElementById('closeClear').addEventListener('click', () => {  				
				app.modalClear.classList.add('hide');
				document.getElementById('closeClear').removeEventListener('click', ()=> {});
  			});		    
		});

	  	app.updateRSS.addEventListener('click', (event) => {			
			app.getData();			
		});

		if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
		}
  	}
};
