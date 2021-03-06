/**
 * @author Caspar Addyman
 * 
 * The graph plotting screen, which sends the data to a
 * webView which uses RGraph library to plot the results. 
 * 
 * Copyright yourbrainondrugs.net 2011
 */

	exports.populateGraphView = function(view){
	
		var gameData;
		var  sizeAxisIcon = 48;
	
		//add the appropriate requires	
		var dataObject = require('/db/dataObject');
		var gameScores = require('/db/gameScores');
		var menu = require('/ui/menu');
		//include the menu choices	
		
		function loadData(){	
			//TODO
			//find a good way to cache this data when it can be cached.
			gameData = gameScores.GamePlaySummary(null, null, null, true);
		}
		
		var webView = Ti.UI.createWebView({
			bottom:60,
			left:0,
			height:'auto',
			width:'auto',
			url:'/charts/chartScatterGameScores.html',
			zIndex:9
		});
		view.add(webView);			
		webView.addEventListener('load', function(e) {
		    // code that fires AFTER webview has loaded
		    redrawGraph();
		 });
		
		var xAxisIcon = Ti.UI.createImageView({
			image:'/icons/newdrinks.png',
			height:sizeAxisIcon,
			width:sizeAxisIcon,
			bottom:30,
			right:4,
			zIndex:10
		});
		view.add(xAxisIcon);	
		xAxisIcon.addEventListener('click', function(){
			//click on the time icon to toggle the time axis
			//and hence the type of graph we plot. 
			changeXAxisIcon();
			redrawGraph();
		});
		
		var labelWeeklyDailyGraph, controlsDrawn = false; 
		
		function drawGraphControls(){	
			//appdebugsteps +='drawGraphControls ..';
			if (controlsDrawn) { return;}
		
			labelWeeklyDailyGraph = Ti.UI.createLabel({
				title: 'Weekly Graph',
				font:{fontSize:12,fontWeight:'bold'},
				bottom : 90,
				right: 10,
				value:true,
				color:'black'
			});
			labelWeeklyDailyGraph.addEventListener('change', function(){
				changeXAxisIcon();
				redrawGraph();
			});
			view.add(labelWeeklyDailyGraph);
			controlsDrawn = true;
		}
		drawGraphControls();
		

		
		function redrawGraph(){
			loadData();
			var stdDrinks = dataObject.getStandardDrinks();
			var mills = stdDrinks[0].MillilitresPerUnit;
			//webView has loaded so we can draw our chart
			var options = {
				// plotDrinks:switchDrinks.value,
				// plotBloodAlcohol:switchBloodAlcohol.value,
				// plotHappiness:switchHappiness.value,
				// plotEnergy:switchEnergy.value,
				// plotDrunk:switchDrunk.value,
				// //plotStroop:switchStroop.value,
				// colorDrinks:switchDrinks.color,
				// colorBloodAlcohol:switchBloodAlcohol.color,
				// colorTotal:switchHappiness.color,
				// colorSpeed:switchEnergy.color,
				// colorCoord:switchDrunk.color,
				// colorInhibit:switchDrunk.color,
				MillsPerStandardDrink:mills
			};

			
			var myData =  JSON.stringify({
				options: options,
				drinkData:gameData.Alcohol_ml,
				bloodAlcohol:gameData.BloodAlcoholConc,
				totalScore:gameData.TotalScore,
				speed:gameData.Speed_GO,
				coord:gameData.Coord_GO,
				inhibit:gameData.InhibitionScore			
			}); 
			webView.evalJS("paintScatterChart('" + myData + "')");
		// } catch (err) {
		    // alert('chart redraw error ' + err.description);
		// }
		}
		
		
		//listen for errors from webView
		webView.addEventListener("error", function(e){
		    Ti.API.log("Error: " + e.message);
			//do something
			alert('Charting error ' + e.message);
		});
	
		
		
		function addSwitch(name,bottom,left,color){
			var newSwitch = Ti.UI.createSwitch({
				style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
				title: name,
				font:{fontSize:12,fontWeight:'bold'},
				bottom :bottom,
				left: left,
				value:Ti.App.Properties.getBool(name,true),
				color:color
			});
			newSwitch.addEventListener('change', function(){
				Ti.App.Properties.setBool(name, newSwitch.value);
				redrawGraph();
			});
			view.add(newSwitch);
		}
		addSwitch('Raccoon Hunt',20,60,'green');
		addSwitch('Pissonyms',0,60,'yellow');
		addSwitch('Memory Game',20,166,'red');
		addSwitch('Emotion Words',0,166,'blue');
		addSwitch('Number Stroop',20,266,'pink');
		addSwitch('We feel fine',0,266,'orange');

		
		
		var labelMenu = Ti.UI.createLabel({
			color:'white',
			font:{fontSize:14,fontFamily:'Helvetica Neue'},
			top:20,
			left:20,
			textAlign:'left',
			text:'Chart options..',
			height:'auto',
			width:'auto'
		});
		view.add(labelMenu);
		
		var settingsButton = Ti.UI.createButton({
			title:'Change..',
			width:70,
			height:28,
			bottom:4,
			right:4,
			backgroundColor:'grey'
		});
		view.add(settingsButton);
		settingsButton.addEventListener('click',function(){
			//show the analysis settings screen.
			Titanium.App.Properties.setString('ChartType', 'Settings');
			var chartMenu = require('/win/win_chartMenu');
			chartMenu.switchChartView();
		});
		return view;
	};
